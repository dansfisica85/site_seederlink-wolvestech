// Mantenho as mensagens em constantes para usar o texto exigido sem variações.
export const APPROVED_MESSAGE =
  'Parabéns, seu crédito foi pré-aprovado. Nosso consultor retornará o contato. Aguarde.';

export const REVIEW_MESSAGE =
  'Ainda precisamos conversar com o(a) Sr(a), um pouco mais. Aguarde o contato do nosso consultor.';

// A média usa 365 dias e termina sete dias antes da consulta, porque os dados
// históricos modelados podem levar alguns dias para serem consolidados.
export const HISTORY_WINDOW_DAYS = 365;
export const HISTORY_DELAY_DAYS = 7;
export const MINIMUM_VALID_DAYS = 350;

// Estas faixas são referências acadêmicas indicativas para a demonstração.
// Elas não substituem ZARC, laudo agronômico ou análise financeira.
export const CLIMATE_CRITERIA = Object.freeze({
  temperature: Object.freeze({
    label: 'Temperatura média',
    min: 20,
    max: 27,
    unit: '°C',
    rangeLabel: '20 a 27 °C',
  }),
  humidity: Object.freeze({
    label: 'Umidade relativa média',
    min: 60,
    max: 80,
    unit: '%',
    rangeLabel: '60% a 80%',
  }),
  radiation: Object.freeze({
    label: 'Radiação solar média',
    min: 8.5,
    unit: 'MJ/m²/dia',
    rangeLabel: 'mínimo de 8,5 MJ/m²/dia',
  }),
});

// O cache reduz chamadas repetidas: dura 30 minutos e guarda até 20 locais.
const REQUEST_CACHE_TTL_MS = 30 * 60 * 1000;
const REQUEST_CACHE_MAX_ENTRIES = 20;
// Defino limites de espera diferentes para condições atuais, histórico principal
// e contingência, evitando que a interface fique carregando para sempre.
const CURRENT_REQUEST_TIMEOUT_MS = 10000;
const PRIMARY_HISTORY_TIMEOUT_MS = 5000;
const FALLBACK_HISTORY_TIMEOUT_MS = 15000;
const requestCache = new Map();

// Uso um erro próprio para apresentar falhas climáticas em linguagem clara.
export class ClimateDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ClimateDataError';
  }
}

// As funções abaixo cuidam de datas, médias e validações numéricas reutilizadas.
function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function shiftUtcDays(date, days) {
  const shifted = new Date(date);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted;
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function compactIsoDate(isoDate) {
  return isoDate.replaceAll('-', '');
}

// Este erro especial diferencia um cancelamento normal de uma falha real.
function createAbortError() {
  const error = new Error('A consulta foi cancelada.');
  error.name = 'AbortError';
  return error;
}

// Calculo uma janela inclusiva de 365 dias usando UTC para não deslocar as datas.
export function getHistoricalPeriod(now = new Date()) {
  const todayUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const endDate = shiftUtcDays(todayUtc, -HISTORY_DELAY_DAYS);
  const startDate = shiftUtcDays(endDate, -(HISTORY_WINDOW_DAYS - 1));

  return {
    start: toIsoDate(startDate),
    end: toIsoDate(endDate),
  };
}

// Antes de montar qualquer URL, confirmo os limites válidos de latitude e longitude.
export function validateCoordinates(latitude, longitude) {
  if (!isFiniteNumber(latitude) || latitude < -90 || latitude > 90) {
    throw new ClimateDataError('Latitude inválida. Selecione outro ponto no mapa.');
  }

  if (!isFiniteNumber(longitude) || longitude < -180 || longitude > 180) {
    throw new ClimateDataError('Longitude inválida. Selecione outro ponto no mapa.');
  }
}

// Converto as listas diárias da API em três médias usadas na triagem.
export function summarizeHistoricalDaily(
  daily,
  minimumValidDays = MINIMUM_VALID_DAYS,
) {
  const times = Array.isArray(daily?.time) ? daily.time : [];
  const temperatures = Array.isArray(daily?.temperature_2m_mean)
    ? daily.temperature_2m_mean
    : [];
  const humidities = Array.isArray(daily?.relative_humidity_2m_mean)
    ? daily.relative_humidity_2m_mean
    : [];
  const radiations = Array.isArray(daily?.shortwave_radiation_sum)
    ? daily.shortwave_radiation_sum
    : [];

  // Um dia só entra no cálculo quando possui data e as três métricas completas.
  const validRows = times.flatMap((time, index) => {
    const temperature = temperatures[index];
    const humidity = humidities[index];
    const radiation = radiations[index];

    if (
      typeof time !== 'string' ||
      !isFiniteNumber(temperature) ||
      !isFiniteNumber(humidity) ||
      !isFiniteNumber(radiation)
    ) {
      return [];
    }

    return [{ time, temperature, humidity, radiation }];
  });

  // Sem pelo menos 350 dias completos eu não mostro uma conclusão enganosa.
  if (validRows.length < minimumValidDays) {
    throw new ClimateDataError(
      `Histórico insuficiente: foram encontrados ${validRows.length} dias válidos; são necessários pelo menos ${minimumValidDays}.`,
    );
  }

  return {
    temperatureMean: mean(validRows.map((row) => row.temperature)),
    humidityMean: mean(validRows.map((row) => row.humidity)),
    radiationMean: mean(validRows.map((row) => row.radiation)),
    validDays: validRows.length,
    periodStart: validRows[0].time,
    periodEnd: validRows[validRows.length - 1].time,
  };
}

// Esta é a função que cruza as informações históricas com os três critérios.
export function evaluateClimateSuitability(historical) {
  const checks = {
    temperature:
      historical.temperatureMean >= CLIMATE_CRITERIA.temperature.min &&
      historical.temperatureMean <= CLIMATE_CRITERIA.temperature.max,
    humidity:
      historical.humidityMean >= CLIMATE_CRITERIA.humidity.min &&
      historical.humidityMean <= CLIMATE_CRITERIA.humidity.max,
    radiation:
      historical.radiationMean >= CLIMATE_CRITERIA.radiation.min,
  };

  // `every(Boolean)` significa E: temperatura, umidade E radiação devem passar.
  const suitable = Object.values(checks).every(Boolean);

  return {
    checks,
    suitable,
    message: suitable ? APPROVED_MESSAGE : REVIEW_MESSAGE,
  };
}

// Aqui eu monto as três consultas oficiais usando a coordenada escolhida.
export function buildClimateUrls(latitude, longitude, now = new Date()) {
  validateCoordinates(latitude, longitude);
  const period = getHistoricalPeriod(now);

  // A Open-Meteo fornece temperatura, umidade e radiação do momento atual.
  const currentParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,shortwave_radiation',
    timezone: 'auto',
  });

  // O histórico principal usa médias/somas diárias do modelo ERA5 seamless.
  const historicalParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    start_date: period.start,
    end_date: period.end,
    daily:
      'temperature_2m_mean,relative_humidity_2m_mean,shortwave_radiation_sum',
    timezone: 'auto',
    models: 'era5_seamless',
  });

  // A NASA POWER é consultada somente como fonte histórica alternativa.
  const nasaPowerParams = new URLSearchParams({
    parameters: 'T2M,RH2M,ALLSKY_SFC_SW_DWN',
    community: 'AG',
    longitude: String(longitude),
    latitude: String(latitude),
    start: compactIsoDate(period.start),
    end: compactIsoDate(period.end),
    format: 'JSON',
    'time-standard': 'LST',
  });

  return {
    currentUrl: `https://api.open-meteo.com/v1/forecast?${currentParams}`,
    historicalUrl: `https://archive-api.open-meteo.com/v1/archive?${historicalParams}`,
    nasaPowerUrl: `https://power.larc.nasa.gov/api/temporal/daily/point?${nasaPowerParams}`,
    period,
  };
}

// A NASA retorna outro formato; eu o converto para as mesmas listas da Open-Meteo.
export function normalizeNasaPowerDaily(payload) {
  const parameters = payload?.properties?.parameter;
  const temperatures = parameters?.T2M;
  const humidities = parameters?.RH2M;
  const radiations = parameters?.ALLSKY_SFC_SW_DWN;

  if (
    !temperatures ||
    typeof temperatures !== 'object' ||
    !humidities ||
    typeof humidities !== 'object' ||
    !radiations ||
    typeof radiations !== 'object'
  ) {
    throw new ClimateDataError('A NASA POWER retornou um histórico incompleto.');
  }

  // Removo valores de preenchimento como -999 antes de calcular qualquer média.
  const fillValue = payload?.header?.fill_value;
  const dates = Object.keys(temperatures).sort();
  const normalizeValue = (value) =>
    isFiniteNumber(value) && value !== fillValue && value > -900 ? value : null;

  return {
    time: dates.map((date) =>
      date.length === 8
        ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
        : date,
    ),
    temperature_2m_mean: dates.map((date) =>
      normalizeValue(temperatures[date]),
    ),
    relative_humidity_2m_mean: dates.map((date) =>
      normalizeValue(humidities[date]),
    ),
    shortwave_radiation_sum: dates.map((date) =>
      normalizeValue(radiations[date]),
    ),
  };
}

// Valido os três campos atuais e traduzo seus nomes para o formato interno.
function parseCurrent(currentPayload) {
  const current = currentPayload?.current;

  if (
    !isFiniteNumber(current?.temperature_2m) ||
    !isFiniteNumber(current?.relative_humidity_2m) ||
    !isFiniteNumber(current?.shortwave_radiation)
  ) {
    throw new ClimateDataError('A Open-Meteo retornou dados atuais incompletos.');
  }

  return {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    radiation: current.shortwave_radiation,
    observedAt: current.time,
  };
}

// Uma resposta HTTP inválida ou um JSON quebrado vira um erro compreensível.
async function parseResponse(response, label) {
  if (!response.ok) {
    throw new ClimateDataError(
      `Não foi possível consultar ${label} (HTTP ${response.status}).`,
    );
  }

  try {
    return await response.json();
  } catch {
    throw new ClimateDataError(`A resposta de ${label} não está em formato válido.`);
  }
}

// Esta função executa um fetch com cancelamento externo e limite de tempo.
async function fetchJsonWithTimeout(
  url,
  label,
  { signal, fetchImpl, timeoutMs },
) {
  if (signal?.aborted) throw createAbortError();

  const controller = new AbortController();
  let timedOut = false;
  // Encaminho também o cancelamento feito pelo componente React.
  const forwardAbort = () => controller.abort();
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  signal?.addEventListener('abort', forwardAbort, { once: true });

  try {
    const response = await fetchImpl(url, { signal: controller.signal });
    return await parseResponse(response, label);
  } catch (error) {
    if (signal?.aborted) throw createAbortError();

    if (timedOut) {
      throw new ClimateDataError(`A consulta de ${label} excedeu o tempo limite.`);
    }

    if (error instanceof ClimateDataError) throw error;

    throw new ClimateDataError(`Não foi possível conectar a ${label}.`);
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', forwardAbort);
  }
}

// Primeiro tento a Open-Meteo; se ela falhar, tento a NASA POWER como contingência.
async function fetchHistoricalWithFallback(
  historicalUrl,
  nasaPowerUrl,
  { signal, fetchImpl },
) {
  try {
    const payload = await fetchJsonWithTimeout(
      historicalUrl,
      'o histórico climático da Open-Meteo',
      {
        signal,
        fetchImpl,
        timeoutMs: PRIMARY_HISTORY_TIMEOUT_MS,
      },
    );

    return {
      summary: summarizeHistoricalDaily(payload?.daily),
      timezone: payload?.timezone,
      provider: 'Open-Meteo',
      providerUrl: 'https://open-meteo.com/en/docs/historical-weather-api',
      isFallback: false,
    };
  } catch (primaryError) {
    // Cancelamentos não devem iniciar uma segunda chamada desnecessária.
    if (signal?.aborted || primaryError?.name === 'AbortError') {
      throw primaryError;
    }

    const fallbackPayload = await fetchJsonWithTimeout(
      nasaPowerUrl,
      'o histórico climático alternativo da NASA POWER',
      {
        signal,
        fetchImpl,
        timeoutMs: FALLBACK_HISTORY_TIMEOUT_MS,
      },
    );

    return {
      summary: summarizeHistoricalDaily(
        normalizeNasaPowerDaily(fallbackPayload),
      ),
      timezone: fallbackPayload?.header?.time_standard,
      provider: 'NASA POWER',
      providerUrl: 'https://power.larc.nasa.gov/',
      isFallback: true,
    };
  }
}

// Arredondo a posição na chave para reaproveitar pontos praticamente iguais.
function getCacheKey(latitude, longitude, period) {
  return `${latitude.toFixed(3)}:${longitude.toFixed(3)}:${period.start}:${period.end}`;
}

// Leio apenas resultados ainda dentro dos 30 minutos definidos no início.
function readCache(key) {
  const cached = requestCache.get(key);

  if (!cached) return null;

  if (Date.now() - cached.createdAt > REQUEST_CACHE_TTL_MS) {
    requestCache.delete(key);
    return null;
  }

  return cached.value;
}

// Ao atingir o limite, retiro a entrada mais antiga antes de continuar.
function writeCache(key, value) {
  requestCache.set(key, { createdAt: Date.now(), value });

  if (requestCache.size > REQUEST_CACHE_MAX_ENTRIES) {
    const oldestKey = requestCache.keys().next().value;
    requestCache.delete(oldestKey);
  }
}

// Esta função existe principalmente para isolar cada teste automatizado.
export function clearClimateCache() {
  requestCache.clear();
}

// Esta função principal coordena todo o caminho: URLs, APIs, médias, regra e cache.
export async function fetchClimateForLocation(
  latitude,
  longitude,
  { signal, now = new Date(), fetchImpl = globalThis.fetch } = {},
) {
  if (typeof fetchImpl !== 'function') {
    throw new ClimateDataError('O navegador não oferece suporte à consulta climática.');
  }

  const { currentUrl, historicalUrl, nasaPowerUrl, period } = buildClimateUrls(
    latitude,
    longitude,
    now,
  );
  const cacheKey = getCacheKey(latitude, longitude, period);
  const cached = readCache(cacheKey);

  // Se já consultei este ponto recentemente, devolvo o resultado sem gastar outra chamada.
  if (cached) return cached;

  let payloads;

  try {
    // Busco condições atuais e histórico ao mesmo tempo para diminuir a espera.
    payloads = await Promise.all([
      fetchJsonWithTimeout(currentUrl, 'as condições atuais', {
        signal,
        fetchImpl,
        timeoutMs: CURRENT_REQUEST_TIMEOUT_MS,
      }),
      fetchHistoricalWithFallback(historicalUrl, nasaPowerUrl, {
        signal,
        fetchImpl,
      }),
    ]);
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    if (error instanceof ClimateDataError) throw error;
    throw new ClimateDataError(
      'Não foi possível conectar ao serviço climático. Verifique sua internet e tente novamente.',
    );
  }

  const [currentPayload, historicalResult] = payloads;
  const current = parseCurrent(currentPayload);
  const historical = {
    ...historicalResult.summary,
    provider: historicalResult.provider,
    providerUrl: historicalResult.providerUrl,
  };
  // Só depois de validar e resumir os dados eu cruzo as três médias.
  const calculatedAssessment = evaluateClimateSuitability(historical);

  // A contingência pode mostrar indicadores, mas nunca libera pré-aprovação automática.
  // Essa regra conservadora evita comparar provedores diferentes como se fossem idênticos.
  const assessment = historicalResult.isFallback
    ? {
        ...calculatedAssessment,
        suitable: false,
        message: REVIEW_MESSAGE,
        dataQualityReview: true,
      }
    : {
        ...calculatedAssessment,
        dataQualityReview: false,
      };

  const result = {
    latitude,
    longitude,
    timezone: currentPayload?.timezone ?? historicalResult.timezone ?? 'auto',
    current,
    historical,
    assessment,
    requestedPeriod: period,
  };

  // Guardo o objeto final já pronto para a interface exibir.
  writeCache(cacheKey, result);
  return result;
}
