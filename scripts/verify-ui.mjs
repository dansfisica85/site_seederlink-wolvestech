// Eu testo o fluxo na interface com respostas climáticas controladas.
// Isso verifica o código de forma repetível; não afirma disponibilidade das APIs reais.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseURL = process.env.TEST_URL || 'http://127.0.0.1:4176/';
const output = process.env.TEST_OUTPUT || 'test-results';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));

function days(start, end) {
  const list = [];
  for (let time = Date.parse(start); time <= Date.parse(end); time += 86400000) list.push(new Date(time).toISOString().slice(0, 10));
  return list;
}
await context.route('**/*open-meteo.com/**', async route => {
  const url = new URL(route.request().url());
  if (url.hostname === 'archive-api.open-meteo.com') {
    if (Number(url.searchParams.get('latitude')) === -15) return route.fulfill({ status: 503, body: '{}' });
    const time = days(url.searchParams.get('start_date'), url.searchParams.get('end_date'));
    const temperature = Number(url.searchParams.get('latitude')) < -25 ? 18 : 24;
    return route.fulfill({ json: { timezone: 'America/Sao_Paulo', daily: {
      time, temperature_2m_mean: time.map(() => temperature),
      relative_humidity_2m_mean: time.map(() => 70), shortwave_radiation_sum: time.map(() => 16),
    } } });
  }
  return route.fulfill({ json: { timezone: 'America/Sao_Paulo', current: {
    temperature_2m: 25, relative_humidity_2m: 65, shortwave_radiation: 450, time: new Date().toISOString().slice(0, 16),
  } } });
});
await context.route('**/power.larc.nasa.gov/**', async route => {
  const url = new URL(route.request().url());
  const iso = value => `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  const times = days(iso(url.searchParams.get('start')), iso(url.searchParams.get('end')));
  const values = number => Object.fromEntries(times.map(day => [day.replaceAll('-', ''), number]));
  await route.fulfill({ json: { header: { fill_value: -999, time_standard: 'UTC' }, properties: {
    parameter: { T2M: values(24), RH2M: values(70), ALLSKY_SFC_SW_DWN: values(16) },
  } } });
});

async function selectPoint(latitude, longitude) {
  await page.getByLabel('Latitude', { exact: true }).fill(String(latitude));
  await page.getByLabel('Longitude', { exact: true }).fill(String(longitude));
  await page.getByRole('button', { name: 'Selecionar coordenadas', exact: true }).click();
  await page.getByRole('button', { name: 'Salvar esta análise na carteira', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Salvar esta análise na carteira', exact: true }).click();
}
async function addProperty(name, latitude, longitude, crop = 'soja') {
  await selectPoint(latitude, longitude);
  await page.getByLabel('Nome da propriedade', { exact: true }).fill(name);
  await page.getByLabel('Cultura', { exact: true }).selectOption(crop);
  await page.getByLabel('Área (hectares)', { exact: true }).fill('25,5');
  await page.getByRole('button', { name: 'Salvar propriedade', exact: true }).click();
  await page.getByRole('heading', { name, exact: true }).waitFor();
}
try {
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Sua carteira de propriedades' }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Salvar propriedade', exact: true }).isDisabled(), true);
  await addProperty('Sítio Boa Esperança', -21.1, -48.1);
  await addProperty('Fazenda Horizonte', -27.1, -50.1, 'tomate');
  assert.equal(await page.getByTestId('property-card').count(), 2);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Sítio Boa Esperança' }).waitFor();
  assert.equal(await page.getByTestId('property-card').count(), 2);
  await page.getByLabel('Comparar Sítio Boa Esperança', { exact: true }).check();
  await page.getByLabel('Comparar Fazenda Horizonte', { exact: true }).check();
  await page.getByRole('button', { name: 'Comparar selecionadas', exact: true }).click();
  await page.getByTestId('portfolio-comparison').waitFor();
  assert.match(await page.getByTestId('portfolio-comparison').innerText(), /24 °C/);
  assert.match(await page.getByTestId('portfolio-comparison').innerText(), /18 °C/);
  await page.locator('.portfolio-toolbar').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${output}/carteira-desktop.png` });
  await page.getByTestId('portfolio-comparison').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${output}/comparacao-desktop.png` });

  // Consulto novamente o mesmo ponto e acrescento um registro ao histórico.
  await selectPoint(-21.1, -48.1);
  const id = await page.getByLabel('Destino da análise').locator('option').nth(1).getAttribute('value');
  await page.getByLabel('Destino da análise').selectOption(id);
  await page.getByRole('button', { name: 'Adicionar ao histórico', exact: true }).click();
  await page.getByText('Histórico · 2 de 5 consultas', { exact: true }).waitFor();

  // A NASA conserva médias favoráveis, mas não passa a ser aprovação automática.
  await addProperty('Sítio Contingência', -15, -47);
  const fallback = page.getByTestId('property-card').filter({ hasText: 'Sítio Contingência' });
  assert.match(await fallback.innerText(), /NASA POWER/);
  assert.match(await fallback.innerText(), /Análise complementar necessária/);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar JSON', exact: true }).click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), 'seederlink-carteira.json');

  await page.getByRole('button', { name: 'Remover Sítio Contingência', exact: true }).click();
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  assert.equal(await page.getByTestId('property-card').count(), 3);
  await page.getByRole('button', { name: 'Remover Sítio Contingência', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar remoção', exact: true }).click();
  assert.equal(await page.getByTestId('property-card').count(), 2);

  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator('#Propriedades').scrollIntoViewIfNeeded();
    // Espero a reorganização do layout e o ResizeObserver do mapa terminarem.
    await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth + 1, null, { timeout: 5000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    assert.equal(overflow, false, `Não deve haver rolagem horizontal geral em ${width}px`);
    if (width === 360) await page.screenshot({ path: `${output}/carteira-mobile.png` });
  }

  // Simulo cota cheia: nenhum cadastro pode sumir e não pode aparecer sucesso falso.
  await selectPoint(-22, -49);
  await page.getByLabel('Nome da propriedade', { exact: true }).fill('Teste sem espaço');
  await page.getByLabel('Área (hectares)', { exact: true }).fill('20');
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Sem espaço', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Salvar propriedade', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'cheio' }).waitFor();
  assert.equal(await page.getByTestId('property-card').count(), 2);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Sítio Boa Esperança' }).waitFor();
  assert.equal(await page.getByTestId('property-card').count(), 2);
  assert.deepEqual(errors, []);

  // Dados corrompidos ficam preservados e o restante do site continua montado.
  await page.evaluate(() => localStorage.setItem('seederlink:fase6:carteira:v1', '{invalido'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('alert').filter({ hasText: 'armazenamento' }).waitFor();
  assert.equal(await page.evaluate(() => localStorage.getItem('seederlink:fase6:carteira:v1')), '{invalido');
  assert.deepEqual(errors, []);
  console.log('OK: salvar, persistir, comparar, histórico, NASA, exportar, cancelar/remover, 3 larguras, cota e corrupção. Zero erros JavaScript.');
} catch (error) {
  await page.screenshot({ path: `${output}/failure.png`, fullPage: false });
  throw error;
} finally {
  await browser.close();
}
