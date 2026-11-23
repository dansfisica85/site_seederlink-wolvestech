// Eu verifico os links que a Home e o PDF usam para identificar a entrega correta.
import test from 'node:test';
import assert from 'node:assert/strict';
import { ENTREGA } from '../src/data/entrega.js';

test('entrega da Fase 7 usa o pitch definitivo, diferente da referência anterior', () => {
  assert.equal(ENTREGA.fase, 7);
  assert.equal(ENTREGA.pitchUrl, 'https://youtu.be/BJ_unP9lmys');
  assert.notEqual(ENTREGA.pitchUrl, ENTREGA.pitchAnteriorUrl);
  assert.equal(Object.isFrozen(ENTREGA), true);
});

test('endereço de deploy aponta para o site publicado com HTTPS', () => {
  const deploy = new URL(ENTREGA.deployUrl);
  assert.equal(deploy.protocol, 'https:');
  assert.ok(deploy.hostname.includes('vercel'), 'deploy deve apontar para a Vercel');
});
