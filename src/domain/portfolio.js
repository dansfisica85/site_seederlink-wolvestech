import {
  evaluateClimateSuitability,
  MINIMUM_VALID_DAYS,
  REVIEW_MESSAGE,
  validateCoordinates,
} from '../lib/climate.js';

export const MAX_PROPERTIES = 10;
export const MAX_ANALYSES = 5;
export const STORAGE_KEY = 'seederlink:fase6:carteira:v1';

// Centralizo as mensagens para o formulário explicar o problema sem mostrar erro técnico.
export class PortfolioError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PortfolioError';
  }
}

function requireObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new PortfolioError(`${label} está em formato inválido.`);
  }
  return value;
}

function text(value, label, min = 1, max = 120) {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
    throw new PortfolioError(`${label} deve ter entre ${min} e ${max} caracteres.`);
  }
  return value.trim();
}

function number(value, label, min, max) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new PortfolioError(`${label} deve ser um número entre ${min} e ${max}.`);
  }
  return value;
}

function date(value, label) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) {
    throw new PortfolioError(`${label} está inválida.`);
  }
  return value;
}

function timestamp(value, label) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(value) ||
      Number.isNaN(Date.parse(value))) {
    throw new PortfolioError(`${label} está inválida.`);
  }
  date(value.slice(0, 10), label);
  return value;
}

// Congelo também os objetos internos: uma consulta salva não muda junto com o mapa.
function freezeDeep(value) {
  for (const item of Object.values(value)) {
    if (item && typeof item === 'object' && !Object.isFrozen(item)) freezeDeep(item);
  }
  return Object.freeze(value);
}

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

export class Localizacao {
  constructor({ latitude, longitude } = {}) {
    validateCoordinates(latitude, longitude);
    this.latitude = latitude;
    this.longitude = longitude;
    Object.freeze(this);
  }

  toJSON() {
    return { latitude: this.latitude, longitude: this.longitude };
  }
}

export class AnaliseClimatica {
  constructor(result, consultedAt = new Date().toISOString()) {
    requireObject(result, 'A análise climática');
    const location = new Localizacao(result);
    const historical = requireObject(result.historical, 'O histórico');
    const current = requireObject(result.current, 'As condições atuais');
    const period = requireObject(result.requestedPeriod, 'O período consultado');
    const start = date(period.start, 'A data inicial');
    const end = date(period.end, 'A data final');
    const periodStart = date(historical.periodStart, 'O início do histórico');
    const periodEnd = date(historical.periodEnd, 'O fim do histórico');
    const dayCount = (Date.parse(end) - Date.parse(start)) / 86400000 + 1;
    if (dayCount < MINIMUM_VALID_DAYS || dayCount > 365 ||
        periodStart < start || periodEnd > end || periodStart > periodEnd) {
      throw new PortfolioError('O período do histórico deve estar dentro da consulta de até 365 dias.');
    }
    const validDays = number(historical.validDays, 'Os dias válidos', MINIMUM_VALID_DAYS, 365);
    const availableDays = (Date.parse(periodEnd) - Date.parse(periodStart)) / 86400000 + 1;
    if (!Number.isInteger(validDays) || validDays > availableDays) {
      throw new PortfolioError('A quantidade de dias válidos não corresponde ao período do histórico.');
    }
    if (!['Open-Meteo', 'NASA POWER'].includes(historical.provider)) {
      throw new PortfolioError('A fonte do histórico climático não é reconhecida.');
    }

    this.latitude = location.latitude;
    this.longitude = location.longitude;
    this.consultedAt = timestamp(consultedAt, 'A data da consulta');
    this.timezone = text(result.timezone ?? 'auto', 'O fuso horário');
    this.requestedPeriod = { start, end };
    this.current = {
      temperature: number(current.temperature, 'A temperatura atual', -100, 70),
      humidity: number(current.humidity, 'A umidade atual', 0, 100),
      radiation: number(current.radiation, 'A radiação atual', 0, 2000),
      observedAt: timestamp(current.observedAt, 'A data das condições atuais'),
    };
    this.historical = {
      temperatureMean: number(historical.temperatureMean, 'A temperatura média', -100, 70),
      humidityMean: number(historical.humidityMean, 'A umidade média', 0, 100),
      radiationMean: number(historical.radiationMean, 'A radiação média', 0, 100),
      validDays,
      periodStart,
      periodEnd,
      provider: historical.provider,
      // Uso os endereços conhecidos em vez de confiar em um link salvo no navegador.
      providerUrl: historical.provider === 'Open-Meteo'
        ? 'https://open-meteo.com/en/docs/historical-weather-api'
        : 'https://power.larc.nasa.gov/',
    };

    // Refaço a regra com os números validados, mesmo ao carregar uma análise antiga.
    // Um campo "suitable" alterado no armazenamento nunca decide a triagem sozinho.
    const calculated = evaluateClimateSuitability(this.historical);
    const isFallback = historical.provider === 'NASA POWER';
    this.assessment = {
      ...calculated,
      suitable: !isFallback && calculated.suitable,
      message: isFallback ? REVIEW_MESSAGE : calculated.message,
      dataQualityReview: isFallback,
    };
    freezeDeep(this);
  }

  static fromClimateResult(result, consultedAt = new Date().toISOString()) {
    return new AnaliseClimatica(result, consultedAt);
  }

  toJSON() {
    return copy({ ...this });
  }
}

export class PropriedadeRural {
  constructor({ id, nome, cultura, areaHectares, localizacao, analises = [] } = {}) {
    this.id = text(id, 'O identificador', 1, 100);
    this.nome = text(nome, 'O nome da propriedade', 2, 80);
    if (!['soja', 'tomate'].includes(cultura)) {
      throw new PortfolioError('Selecione a cultura de soja ou tomate.');
    }
    this.cultura = cultura;
    // Aceito vírgula decimal, comum no preenchimento em português.
    const area = typeof areaHectares === 'string' && /^\d+(?:[.,]\d+)?$/.test(areaHectares.trim())
      ? Number(areaHectares.trim().replace(',', '.')) : areaHectares;
    this.areaHectares = number(area, 'A área em hectares', 0.0001, 1000000);
    this.localizacao = localizacao instanceof Localizacao
      ? localizacao : new Localizacao(requireObject(localizacao, 'A localização'));
    if (!Array.isArray(analises) || analises.length > MAX_ANALYSES) {
      throw new PortfolioError(`Uma propriedade pode guardar até ${MAX_ANALYSES} análises.`);
    }
    this.analises = analises.map((item) => {
      const analysis = item instanceof AnaliseClimatica
        ? item : new AnaliseClimatica(item, timestamp(item?.consultedAt, 'A data da consulta salva'));
      if (analysis.latitude !== this.localizacao.latitude || analysis.longitude !== this.localizacao.longitude) {
        throw new PortfolioError('A análise pertence a outra localização. Consulte o ponto desta propriedade.');
      }
      return analysis;
    }).sort((a, b) => Date.parse(a.consultedAt) - Date.parse(b.consultedAt));
    freezeDeep(this);
  }

  adicionarAnalise(analise) {
    if (!(analise instanceof AnaliseClimatica)) {
      throw new PortfolioError('Consulte o clima antes de adicionar uma análise.');
    }
    // O histórico mantém as cinco consultas mais recentes, sem mudar o objeto anterior.
    const analises = [...this.analises, analise]
      .sort((a, b) => Date.parse(a.consultedAt) - Date.parse(b.consultedAt))
      .slice(-MAX_ANALYSES);
    // Valido a localização antes do corte para não descartar silenciosamente uma análise errada.
    if (analise.latitude !== this.localizacao.latitude || analise.longitude !== this.localizacao.longitude) {
      throw new PortfolioError('A análise pertence a outra localização. Consulte o ponto desta propriedade.');
    }
    return new PropriedadeRural({ ...this, analises });
  }

  resumo() {
    return this.analises.at(-1) ?? null;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      cultura: this.cultura,
      areaHectares: this.areaHectares,
      localizacao: this.localizacao.toJSON(),
      analises: this.analises.map((item) => item.toJSON()),
    };
  }
}

export class CarteiraPropriedades {
  constructor(propriedades = []) {
    if (!Array.isArray(propriedades) || propriedades.length > MAX_PROPERTIES) {
      throw new PortfolioError(`A carteira pode guardar até ${MAX_PROPERTIES} propriedades.`);
    }
    this.propriedades = propriedades.map((item) => item instanceof PropriedadeRural
      ? item : new PropriedadeRural(item));
    if (new Set(this.propriedades.map((item) => item.id)).size !== this.propriedades.length) {
      throw new PortfolioError('Já existe uma propriedade com esse identificador.');
    }
    freezeDeep(this);
  }

  adicionar(propriedade) {
    if (!(propriedade instanceof PropriedadeRural)) {
      throw new PortfolioError('Informe os dados válidos de uma propriedade.');
    }
    return new CarteiraPropriedades([...this.propriedades, propriedade]);
  }

  remover(id) {
    if (!this.buscar(id)) throw new PortfolioError('Propriedade não encontrada.');
    return new CarteiraPropriedades(this.propriedades.filter((item) => item.id !== id));
  }

  buscar(id) {
    return this.propriedades.find((item) => item.id === id) ?? null;
  }

  comparar(id1, id2) {
    if (id1 === id2) throw new PortfolioError('Selecione duas propriedades diferentes para comparar.');
    const propriedades = [this.buscar(id1), this.buscar(id2)];
    if (propriedades.some((item) => !item)) throw new PortfolioError('Propriedade não encontrada.');
    const [first, second] = propriedades.map((item) => item.resumo());
    const motivos = [];
    if (!first || !second) {
      motivos.push('As duas propriedades precisam ter uma análise climática salva.');
    } else {
      if (first.historical.provider !== second.historical.provider) {
        motivos.push('As análises usam fontes climáticas diferentes.');
      }
      if (first.requestedPeriod.start !== second.requestedPeriod.start ||
          first.requestedPeriod.end !== second.requestedPeriod.end ||
          first.historical.periodStart !== second.historical.periodStart ||
          first.historical.periodEnd !== second.historical.periodEnd ||
          first.historical.validDays !== second.historical.validDays) {
        motivos.push('As análises usam períodos ou quantidades de dias válidos diferentes.');
      }
    }
    // A comparação exibe dados lado a lado; não escolhe quem deve receber crédito.
    return freezeDeep({ propriedades, compativeis: motivos.length === 0, motivos });
  }

  toJSON() {
    return { version: 1, propriedades: this.propriedades.map((item) => item.toJSON()) };
  }

  static fromJSON(value) {
    requireObject(value, 'A carteira salva');
    if (value.version !== 1 || !Array.isArray(value.propriedades)) {
      throw new PortfolioError('A carteira salva está em formato ou versão incompatível.');
    }
    return new CarteiraPropriedades(value.propriedades);
  }
}

export class RepositorioLocal {
  constructor(storage, key = STORAGE_KEY) {
    // Recebo o armazenamento por parâmetro para permitir testes sem navegador.
    this.storage = storage;
    this.key = text(key, 'A chave do armazenamento', 1, 150);
  }

  carregar() {
    let raw;
    try {
      raw = this.storage.getItem(this.key);
    } catch {
      throw new PortfolioError('O navegador bloqueou o acesso à carteira local. Verifique as permissões de armazenamento.');
    }
    if (raw === null) return new CarteiraPropriedades();
    try {
      return CarteiraPropriedades.fromJSON(JSON.parse(raw));
    } catch (error) {
      throw new PortfolioError(`Não foi possível ler a carteira salva. Os dados foram preservados. ${error instanceof PortfolioError ? error.message : 'O conteúdo está corrompido.'}`);
    }
  }

  salvar(carteira) {
    if (!(carteira instanceof CarteiraPropriedades)) {
      throw new PortfolioError('A carteira não está em formato válido para salvar.');
    }
    // Valido uma cópia antes de gravar e nunca substituo um conteúdo corrompido sem aviso.
    const validated = CarteiraPropriedades.fromJSON(carteira.toJSON());
    this.carregar();
    try {
      this.storage.setItem(this.key, JSON.stringify(validated.toJSON()));
    } catch (error) {
      if (error?.name === 'QuotaExceededError' || error?.code === 22 || error?.code === 1014) {
        throw new PortfolioError('O armazenamento do navegador está cheio. A alteração não foi salva.');
      }
      throw new PortfolioError('O navegador não permitiu salvar a carteira. A alteração não foi salva.');
    }
    // A interface só substitui seu estado depois que esta gravação termina com sucesso.
    return validated;
  }
}
