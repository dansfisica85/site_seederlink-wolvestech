import test from 'node:test';
import assert from 'node:assert/strict';
import {
  APPROVED_MESSAGE,
  ClimateDataError,
  REVIEW_MESSAGE,
  buildClimateUrls,
  clearClimateCache,
  evaluateClimateSuitability,
  fetchClimateForLocation,
  getHistoricalPeriod,
  normalizeNasaPowerDaily,
  summarizeHistoricalDaily,
  validateCoordinates,
} from '../src/lib/climate.js';

// Primeiro eu verifico a janela histórica e o cálculo somente com dias completos.
test('calcula uma janela histórica inclusiva de 365 dias com atraso de 7 dias', () => {
  assert.deepEqual(getHistoricalPeriod(new Date('2026-09-03T12:00:00Z')), {
    start: '2025-08-28',
    end: '2026-08-27',
  });
});

test('calcula médias somente com dias que possuem as três métricas', () => {
  const summary = summarizeHistoricalDaily(
    {
      time: ['2026-01-01', '2026-01-02', '2026-01-03'],
      temperature_2m_mean: [20, null, 26],
      relative_humidity_2m_mean: [60, 65, 80],
      shortwave_radiation_sum: [8.5, 10, 11.5],
    },
    2,
  );

  assert.equal(summary.temperatureMean, 23);
  assert.equal(summary.humidityMean, 70);
  assert.equal(summary.radiationMean, 10);
  assert.equal(summary.validDays, 2);
  assert.equal(summary.periodStart, '2026-01-01');
  assert.equal(summary.periodEnd, '2026-01-03');
});

test('não emite decisão quando o histórico é insuficiente', () => {
  assert.throws(
    () =>
      summarizeHistoricalDaily(
        {
          time: ['2026-01-01'],
          temperature_2m_mean: [24],
          relative_humidity_2m_mean: [70],
          shortwave_radiation_sum: [12],
        },
        2,
      ),
    ClimateDataError,
  );
});

// Depois eu testo os dois caminhos da regra e os textos exatos do enunciado.
test('aprova nos limites inclusivos dos critérios e preserva a mensagem exigida', () => {
  const assessment = evaluateClimateSuitability({
    temperatureMean: 20,
    humidityMean: 80,
    radiationMean: 8.5,
  });

  assert.equal(assessment.suitable, true);
  assert.equal(assessment.message, APPROVED_MESSAGE);
  assert.equal(
    assessment.message,
    'Parabéns, seu crédito foi pré-aprovado. Nosso consultor retornará o contato. Aguarde.',
  );
});

test('solicita análise complementar quando qualquer critério falha', () => {
  const assessment = evaluateClimateSuitability({
    temperatureMean: 27.1,
    humidityMean: 70,
    radiationMean: 12,
  });

  assert.equal(assessment.suitable, false);
  assert.equal(assessment.checks.temperature, false);
  assert.equal(assessment.message, REVIEW_MESSAGE);
  assert.equal(
    assessment.message,
    'Ainda precisamos conversar com o(a) Sr(a), um pouco mais. Aguarde o contato do nosso consultor.',
  );
});

// Aqui eu confirmo coordenadas, fontes oficiais, período e ausência de chave na URL.
test('valida coordenadas e monta URLs oficiais sem chave de API', () => {
  validateCoordinates(-23.5505, -46.6333);
  assert.throws(() => validateCoordinates(91, 0), ClimateDataError);
  assert.throws(() => validateCoordinates(0, -181), ClimateDataError);

  const urls = buildClimateUrls(
    -23.5505,
    -46.6333,
    new Date('2026-09-03T12:00:00Z'),
  );

  assert.match(urls.currentUrl, /^https:\/\/api\.open-meteo\.com\/v1\/forecast\?/);
  assert.match(urls.currentUrl, /temperature_2m/);
  assert.match(urls.historicalUrl, /^https:\/\/archive-api\.open-meteo\.com\/v1\/archive\?/);
  assert.match(urls.historicalUrl, /models=era5_seamless/);
  assert.match(urls.historicalUrl, /start_date=2025-08-28/);
  assert.match(urls.historicalUrl, /end_date=2026-08-27/);
  assert.match(
    urls.nasaPowerUrl,
    /^https:\/\/power\.larc\.nasa\.gov\/api\/temporal\/daily\/point\?/,
  );
  assert.match(urls.nasaPowerUrl, /parameters=T2M%2CRH2M%2CALLSKY_SFC_SW_DWN/);
  assert.match(urls.nasaPowerUrl, /start=20250828/);
  assert.match(urls.nasaPowerUrl, /end=20260827/);
  assert.doesNotMatch(urls.currentUrl, /apikey/i);
  assert.doesNotMatch(urls.historicalUrl, /apikey/i);
  assert.doesNotMatch(urls.nasaPowerUrl, /apikey/i);
});

// Por fim eu valido a conversão e a regra conservadora da fonte alternativa.
test('normaliza a resposta diária da NASA POWER e descarta valores de preenchimento', () => {
  const daily = normalizeNasaPowerDaily({
    header: { fill_value: -999 },
    properties: {
      parameter: {
        T2M: { 20260101: 24, 20260102: -999 },
        RH2M: { 20260101: 70, 20260102: 71 },
        ALLSKY_SFC_SW_DWN: { 20260101: 18, 20260102: 19 },
      },
    },
  });

  assert.deepEqual(daily.time, ['2026-01-01', '2026-01-02']);
  assert.deepEqual(daily.temperature_2m_mean, [24, null]);
  assert.deepEqual(daily.relative_humidity_2m_mean, [70, 71]);
  assert.deepEqual(daily.shortwave_radiation_sum, [18, 19]);
});

test('usa NASA POWER quando o histórico primário está indisponível', async () => {
  clearClimateCache();
  const start = new Date('2025-08-28T12:00:00Z');
  const nasaParameters = {
    T2M: {},
    RH2M: {},
    ALLSKY_SFC_SW_DWN: {},
  };

  for (let index = 0; index < 365; index += 1) {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + index);
    const key = date.toISOString().slice(0, 10).replaceAll('-', '');
    nasaParameters.T2M[key] = 24;
    nasaParameters.RH2M[key] = 70;
    nasaParameters.ALLSKY_SFC_SW_DWN[key] = 18;
  }

  // Estas respostas simuladas permitem testar a contingência sem depender da internet.
  const jsonResponse = (payload, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  });

  const fetchImpl = async (url) => {
    if (url.startsWith('https://api.open-meteo.com/')) {
      return jsonResponse({
        timezone: 'America/Sao_Paulo',
        current: {
          temperature_2m: 25,
          relative_humidity_2m: 65,
          shortwave_radiation: 700,
          time: '2026-09-03T12:00',
        },
      });
    }

    if (url.startsWith('https://archive-api.open-meteo.com/')) {
      return jsonResponse({}, 502);
    }

    return jsonResponse({
      header: { fill_value: -999, time_standard: 'LST' },
      properties: { parameter: nasaParameters },
    });
  };

  const result = await fetchClimateForLocation(-23.5505, -46.6333, {
    now: new Date('2026-09-03T12:00:00Z'),
    fetchImpl,
  });

  assert.equal(result.historical.provider, 'NASA POWER');
  assert.equal(result.historical.validDays, 365);
  assert.equal(result.assessment.checks.temperature, true);
  assert.equal(result.assessment.checks.humidity, true);
  assert.equal(result.assessment.checks.radiation, true);
  assert.equal(result.assessment.dataQualityReview, true);
  assert.equal(result.assessment.suitable, false);
  assert.equal(result.assessment.message, REVIEW_MESSAGE);
});
