import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AnaliseClimatica, CarteiraPropriedades, Localizacao, PropriedadeRural,
  RepositorioLocal, STORAGE_KEY,
} from '../src/domain/portfolio.js';
import { APPROVED_MESSAGE, REVIEW_MESSAGE } from '../src/lib/climate.js';

// Uso dados conhecidos para conferir a regra sem depender da internet nos testes.
function climate(overrides = {}) {
  return {
    latitude: -21.1,
    longitude: -48.1,
    timezone: 'America/Sao_Paulo',
    current: { temperature: 25, humidity: 65, radiation: 430, observedAt: '2026-10-07T12:00' },
    historical: {
      temperatureMean: 24, humidityMean: 70, radiationMean: 16,
      validDays: 365, periodStart: '2025-10-01', periodEnd: '2026-09-30',
      provider: 'Open-Meteo', providerUrl: 'https://open-meteo.com/en/docs/historical-weather-api',
    },
    requestedPeriod: { start: '2025-10-01', end: '2026-09-30' },
    assessment: { suitable: true, message: APPROVED_MESSAGE },
    ...overrides,
  };
}

function analysis(result = climate(), date = '2026-10-07T12:00:00.000Z') {
  return AnaliseClimatica.fromClimateResult(result, date);
}

function property(overrides = {}) {
  return new PropriedadeRural({
    id: 'sitio-1', nome: 'Sítio Esperança', cultura: 'soja', areaHectares: 20,
    localizacao: new Localizacao({ latitude: -21.1, longitude: -48.1 }),
    analises: [analysis()], ...overrides,
  });
}

function memoryStorage() {
  const records = new Map();
  return { getItem: (key) => records.get(key) ?? null, setItem: (key, value) => records.set(key, value) };
}

test('salva, recarrega e reconstrói classes com o histórico climático completo', () => {
  const storage = memoryStorage();
  const repo = new RepositorioLocal(storage);
  assert.equal(repo.carregar().propriedades.length, 0);
  const original = new CarteiraPropriedades([property()]);
  const saved = repo.salvar(original);
  const loaded = new RepositorioLocal(storage).carregar();
  assert.deepEqual(loaded.toJSON(), original.toJSON());
  assert.notEqual(saved, original);
  assert.ok(loaded.buscar('sitio-1') instanceof PropriedadeRural);
  assert.ok(loaded.buscar('sitio-1').localizacao instanceof Localizacao);
  assert.ok(loaded.buscar('sitio-1').resumo() instanceof AnaliseClimatica);
  assert.equal(loaded.buscar('sitio-1').resumo().historical.validDays, 365);
});

test('valida localização, nome, cultura e área e aceita vírgula decimal', () => {
  for (const latitude of [91, -91, NaN, '10']) {
    assert.throws(() => new Localizacao({ latitude, longitude: 0 }));
  }
  assert.throws(() => new Localizacao({ latitude: 0, longitude: 181 }));
  for (const nome of ['', ' ', 'x', 'a'.repeat(81)]) assert.throws(() => property({ nome }));
  assert.throws(() => property({ cultura: 'milho' }));
  for (const areaHectares of [0, -1, Infinity, '1e4', '', 1000001]) {
    assert.throws(() => property({ areaHectares }));
  }
  assert.equal(property({ areaHectares: '12,5' }).areaHectares, 12.5);
});

test('inclusão e exclusão retornam novas carteiras e rejeitam identificador repetido', () => {
  const empty = new CarteiraPropriedades();
  const added = empty.adicionar(property());
  assert.equal(empty.propriedades.length, 0);
  assert.equal(added.propriedades.length, 1);
  assert.throws(() => added.adicionar(property()), /identificador/);
  assert.throws(() => new CarteiraPropriedades([property(), property()]), /identificador/);
  const removed = added.remover('sitio-1');
  assert.equal(added.propriedades.length, 1);
  assert.equal(removed.propriedades.length, 0);
  assert.equal(removed.buscar('sitio-1'), null);
  assert.throws(() => removed.remover('desconhecido'), /não encontrada/);
});

test('limite de dez propriedades é aplicado também durante leitura', () => {
  const ten = Array.from({ length: 10 }, (_, index) => property({ id: `p-${index}` }));
  const carteira = new CarteiraPropriedades(ten);
  assert.throws(() => carteira.adicionar(property()), /10 propriedades/);
  const serialized = carteira.toJSON();
  serialized.propriedades.push(property().toJSON());
  assert.throws(() => CarteiraPropriedades.fromJSON(serialized), /10 propriedades/);
});

test('snapshot não muda com o resultado original ou com o JSON devolvido', () => {
  const result = climate();
  const snapshot = analysis(result);
  result.historical.temperatureMean = 50;
  result.current.humidity = 0;
  const exported = snapshot.toJSON();
  exported.historical.temperatureMean = 1;
  assert.equal(snapshot.historical.temperatureMean, 24);
  assert.equal(snapshot.current.humidity, 65);
  assert.throws(() => { snapshot.assessment.suitable = false; }, TypeError);
  assert.throws(() => { property().analises.push(snapshot); }, TypeError);
});

test('recalcula a triagem com limiares inclusivos sem confiar no resultado salvo', () => {
  for (const values of [
    { temperatureMean: 20, humidityMean: 60, radiationMean: 8.5 },
    { temperatureMean: 27, humidityMean: 80, radiationMean: 8.5 },
  ]) {
    const result = climate();
    Object.assign(result.historical, values);
    result.assessment = { suitable: false, message: REVIEW_MESSAGE };
    assert.equal(analysis(result).assessment.suitable, true);
  }
  for (const values of [
    { temperatureMean: 19.99 }, { temperatureMean: 27.01 },
    { humidityMean: 59.99 }, { humidityMean: 80.01 }, { radiationMean: 8.49 },
  ]) {
    const result = climate();
    Object.assign(result.historical, values);
    assert.equal(analysis(result).assessment.suitable, false);
    assert.equal(analysis(result).assessment.message, REVIEW_MESSAGE);
  }
});

test('NASA POWER conserva indicadores, mas sempre exige revisão', () => {
  const result = climate();
  result.historical.provider = 'NASA POWER';
  result.historical.providerUrl = 'javascript:alert(1)';
  const snapshot = analysis(result);
  assert.equal(snapshot.assessment.suitable, false);
  assert.equal(snapshot.assessment.dataQualityReview, true);
  assert.equal(snapshot.assessment.checks.temperature, true);
  assert.equal(snapshot.historical.providerUrl, 'https://power.larc.nasa.gov/');
  assert.equal(snapshot.assessment.message, REVIEW_MESSAGE);
});

test('rejeita snapshots incompletos, fonte desconhecida e histórico inconsistente', () => {
  for (const edit of [
    (result) => { delete result.current; },
    (result) => { result.historical.provider = 'desconhecida'; },
    (result) => { result.historical.validDays = 349; },
    (result) => { result.historical.validDays = 365.5; },
    (result) => { result.historical.humidityMean = 101; },
    (result) => { result.current.radiation = -1; },
    (result) => { result.historical.temperatureMean = NaN; },
    (result) => { result.historical.periodStart = '2026-02-30'; },
    (result) => { result.requestedPeriod.end = '2025-01-01'; },
    (result) => { result.historical.periodStart = '2025-09-30'; },
  ]) {
    const result = climate();
    edit(result);
    assert.throws(() => analysis(result));
  }
  assert.throws(() => analysis(climate(), 'ontem'));
});

test('histórico mantém cinco consultas mais recentes e recusa outro ponto', () => {
  let current = property({ analises: [] });
  assert.equal(current.resumo(), null);
  for (let day = 1; day <= 6; day += 1) {
    current = current.adicionarAnalise(analysis(climate(), `2026-10-0${day}T12:00:00.000Z`));
  }
  assert.equal(current.analises.length, 5);
  assert.match(current.analises[0].consultedAt, /10-02/);
  assert.match(current.resumo().consultedAt, /10-06/);
  assert.throws(() => current.adicionarAnalise(analysis(climate({ latitude: 0 }))), /outra localização/);
  assert.throws(() => property({ analises: [analysis(climate({ longitude: 0 }))] }), /outra localização/);
  assert.throws(() => property({ analises: Array(6).fill(analysis()) }), /5 análises/);
});

test('comparação informa compatibilidade de período e fonte, sem ordenar crédito', () => {
  const first = property();
  const second = property({ id: 'sitio-2', cultura: 'tomate' });
  let carteira = new CarteiraPropriedades([first, second]);
  const comparison = carteira.comparar('sitio-2', 'sitio-1');
  assert.equal(comparison.compativeis, true);
  assert.deepEqual(comparison.propriedades.map((item) => item.id), ['sitio-2', 'sitio-1']);
  assert.deepEqual(comparison.motivos, []);
  const result = climate();
  result.historical.provider = 'NASA POWER';
  result.historical.validDays = 364;
  carteira = new CarteiraPropriedades([first, property({ id: 'sitio-2', analises: [analysis(result)] })]);
  assert.equal(carteira.comparar('sitio-1', 'sitio-2').compativeis, false);
  assert.equal(carteira.comparar('sitio-1', 'sitio-2').motivos.length, 2);
  assert.throws(() => carteira.comparar('sitio-1', 'sitio-1'), /diferentes/);
  assert.throws(() => carteira.comparar('sitio-1', 'ausente'), /não encontrada/);
  const noHistory = new CarteiraPropriedades([first, property({ id: 'sitio-2', analises: [] })]);
  assert.equal(noHistory.comparar('sitio-1', 'sitio-2').compativeis, false);
});

test('conteúdo corrompido ou versão desconhecida é preservado e bloqueia gravação', () => {
  for (const raw of ['{quebrado', '', 'null', '{}', '{"version":2,"propriedades":[]}']) {
    const storage = memoryStorage();
    storage.setItem(STORAGE_KEY, raw);
    const repo = new RepositorioLocal(storage);
    assert.throws(() => repo.carregar(), /dados foram preservados/);
    assert.throws(() => repo.salvar(new CarteiraPropriedades()), /dados foram preservados/);
    assert.equal(storage.getItem(STORAGE_KEY), raw);
  }
});

test('leitura não inventa uma data para análise salva incompleta', () => {
  const saved = new CarteiraPropriedades([property()]).toJSON();
  delete saved.propriedades[0].analises[0].consultedAt;
  assert.throws(() => CarteiraPropriedades.fromJSON(saved), /data da consulta salva/);
  assert.throws(() => analysis(climate(), '2026-02-30T12:00:00Z'), /inválida/);
});

test('cota cheia mantém dados gravados e a carteira anterior sem mudança', () => {
  const storage = memoryStorage();
  const repo = new RepositorioLocal(storage);
  const previous = repo.salvar(new CarteiraPropriedades([property()]));
  const stored = storage.getItem(STORAGE_KEY);
  storage.setItem = () => { throw Object.assign(new Error('cheio'), { name: 'QuotaExceededError' }); };
  const candidate = previous.adicionar(property({ id: 'sitio-2' }));
  assert.throws(() => repo.salvar(candidate), /cheio.*não foi salva/);
  assert.equal(storage.getItem(STORAGE_KEY), stored);
  assert.equal(previous.propriedades.length, 1);
  assert.equal(candidate.propriedades.length, 2);
});

test('permissão negada é explicada para leitura e gravação', () => {
  const deniedRead = new RepositorioLocal({ getItem() { throw new Error('denied'); } });
  assert.throws(() => deniedRead.carregar(), /bloqueou o acesso/);
  const deniedWrite = new RepositorioLocal({ getItem: () => null, setItem() { throw new Error('denied'); } });
  assert.throws(() => deniedWrite.salvar(new CarteiraPropriedades()), /não permitiu salvar/);
});
