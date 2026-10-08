import React, { useEffect, useRef, useState } from 'react';
import {
  AnaliseClimatica, CarteiraPropriedades as Carteira, Localizacao,
  PropriedadeRural, RepositorioLocal, STORAGE_KEY,
} from '../domain/portfolio';
import '../styles/portfolio.css';

const number = (value, digits = 1) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: digits }).format(value);
const date = (value) => new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(value));
const period = (analysis) => `${date(analysis.historical.periodStart)} a ${date(analysis.historical.periodEnd)}`;
const culture = (value) => value === 'soja' ? 'Soja' : 'Tomate';

// Tento abrir a carteira uma vez. Se houver dados danificados, eu os preservo
// e bloqueio a gravação, em vez de apagar silenciosamente o trabalho do usuário.
function openPortfolio() {
  try {
    const storage = window.localStorage;
    const repository = new RepositorioLocal(storage, STORAGE_KEY);
    return { repository, portfolio: repository.carregar(), raw: storage.getItem(STORAGE_KEY), error: '' };
  } catch (error) {
    return { repository: null, portfolio: new Carteira(), raw: null, error: error.message };
  }
}

// Reutilizo o mesmo resumo no cartão e no histórico, sempre com as unidades corretas.
function AnalysisSummary({ analysis }) {
  if (!analysis) return <p>Ainda não há análise salva.</p>;
  return <>
    <dl className="portfolio-metrics">
      <div><dt>Temperatura média</dt><dd>{number(analysis.historical.temperatureMean)} °C</dd></div>
      <div><dt>Umidade média</dt><dd>{number(analysis.historical.humidityMean)}%</dd></div>
      <div><dt>Radiação média</dt><dd>{number(analysis.historical.radiationMean)} MJ/m²/dia</dd></div>
    </dl>
    <p className="portfolio-meta">{analysis.historical.provider} · {analysis.historical.validDays} dias válidos<br />
      {period(analysis)} · Consulta capturada em {date(analysis.consultedAt)}</p>
    <p className={`portfolio-status ${analysis.assessment.suitable ? 'is-positive' : ''}`}>
      {analysis.assessment.suitable ? 'Critérios climáticos atendidos' : 'Análise complementar necessária'}
    </p>
    {analysis.assessment.dataQualityReview && <p className="portfolio-warning">Fonte alternativa NASA POWER: a pré-aprovação automática permanece bloqueada.</p>}
  </>;
}

// A tabela compara valores, mas não escolhe uma propriedade "melhor" nem aprova crédito.
function Comparison({ comparison }) {
  const [first, second] = comparison.propriedades;
  const rows = [
    ['Cultura', p => culture(p.cultura)],
    ['Área informada', p => `${number(p.areaHectares, 2)} ha`],
    ['Coordenadas', p => `${number(p.localizacao.latitude, 5)}, ${number(p.localizacao.longitude, 5)}`],
    ['Temperatura média', p => `${number(p.resumo().historical.temperatureMean)} °C`],
    ['Umidade média', p => `${number(p.resumo().historical.humidityMean)}%`],
    ['Radiação média', p => `${number(p.resumo().historical.radiationMean)} MJ/m²/dia`],
    ['Histórico analisado', p => period(p.resumo())],
    ['Dias válidos', p => p.resumo().historical.validDays],
    ['Fonte', p => p.resumo().historical.provider],
    ['Consulta capturada', p => date(p.resumo().consultedAt)],
    ['Triagem acadêmica', p => p.resumo().assessment.suitable ? 'Critérios atendidos' : 'Análise complementar'],
  ];
  return <div className="portfolio-comparison" data-testid="portfolio-comparison">
    <h3>Comparação lado a lado</h3>
    {!comparison.compativeis && <p className="portfolio-warning" role="status">
      Atenção: {comparison.motivos.join(' ')} Considere essas diferenças ao interpretar os valores.
    </p>}
    <p>Comparo a análise mais recente de cada cadastro. Área e cultura são informações cadastrais; não alteram a regra climática.</p>
    <div className="portfolio-table-scroll" tabIndex={0} role="region" aria-label="Tabela comparativa; role para os lados em telas pequenas">
      <table><caption>Dados salvos de {first.nome} e {second.nome}</caption>
        <thead><tr><th scope="col">Informação</th><th scope="col">{first.nome}</th><th scope="col">{second.nome}</th></tr></thead>
        <tbody>{rows.map(([label, getValue]) => <tr key={label}><th scope="row">{label}</th><td>{getValue(first)}</td><td>{getValue(second)}</td></tr>)}</tbody>
      </table>
    </div>
  </div>;
}

export default function CarteiraPropriedades({ analysisToSave, onAnalysisSaved }) {
  const [initial] = useState(openPortfolio);
  const [portfolio, setPortfolio] = useState(initial.portfolio);
  const [storageError, setStorageError] = useState(initial.error);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({ nome: '', cultura: 'soja', areaHectares: '', existingId: '' });
  const [selected, setSelected] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const expectedRaw = useRef(initial.raw);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!analysisToSave) return;
    setMessage('Análise recebida do mapa. Confira o ponto e complete o cadastro para salvar.');
    setError('');
    // Levo o teclado junto com a rolagem para o usuário não perder o contexto.
    titleRef.current?.focus({ preventScroll: true });
    titleRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }, [analysisToSave]);

  useEffect(() => {
    // Evito que duas abas sobrescrevam as alterações uma da outra sem aviso.
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) setStorageError('A carteira mudou em outra aba. Recarregue a página antes de continuar.');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = (next) => {
    if (storageError || !initial.repository) throw new Error(storageError || 'Armazenamento indisponível.');
    if (window.localStorage.getItem(STORAGE_KEY) !== expectedRaw.current) {
      setStorageError('A carteira mudou em outra aba. Recarregue a página antes de continuar.');
      throw new Error('Nenhum dado foi sobrescrito. Recarregue a página para abrir a versão mais recente.');
    }
    // Só atualizo a tela depois da gravação. Se faltar espaço, os dados anteriores ficam intactos.
    const saved = initial.repository.salvar(next);
    expectedRaw.current = window.localStorage.getItem(STORAGE_KEY);
    setPortfolio(saved);
    setComparison(null);
  };

  const saveProperty = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      if (!analysisToSave) throw new Error('Selecione um ponto no mapa e envie a análise para a carteira primeiro.');
      const analysis = AnaliseClimatica.fromClimateResult(analysisToSave.result, analysisToSave.consultedAt);
      let next;
      if (draft.existingId) {
        const property = portfolio.buscar(draft.existingId);
        if (!property) throw new Error('O cadastro escolhido não está mais disponível.');
        const updated = property.adicionarAnalise(analysis);
        next = portfolio.remover(property.id).adicionar(updated);
      } else {
        const property = new PropriedadeRural({
          id: crypto.randomUUID(), nome: draft.nome, cultura: draft.cultura,
          areaHectares: draft.areaHectares,
          localizacao: new Localizacao({ latitude: analysis.latitude, longitude: analysis.longitude }),
          analises: [analysis],
        });
        next = portfolio.adicionar(property);
      }
      persist(next);
      setMessage(draft.existingId ? 'Nova análise adicionada ao histórico da propriedade.' : 'Propriedade salva neste navegador. Você já pode selecioná-la para comparar.');
      setDraft({ nome: '', cultura: 'soja', areaHectares: '', existingId: '' });
      onAnalysisSaved();
    } catch (cause) { setError(cause.message); }
  };

  const removeProperty = (id) => {
    try {
      persist(portfolio.remover(id));
      setSelected(previous => previous.filter(value => value !== id));
      setRemovingId(null);
      setError('');
      setMessage('Propriedade removida desta carteira. As outras propriedades foram preservadas.');
      titleRef.current?.focus({ preventScroll: true });
    } catch (cause) { setError(cause.message); }
  };

  const compare = () => {
    try {
      if (selected.some(id => !portfolio.buscar(id)?.resumo())) throw new Error('As duas propriedades precisam ter uma análise salva para comparar.');
      setComparison(portfolio.comparar(...selected));
      setError('');
      setMessage('Comparação pronta. A tabela está logo abaixo dos cartões.');
    } catch (cause) { setError(cause.message); }
  };

  const exportPortfolio = () => {
    // O arquivo é um backup legível. Não é enviado para servidor e não contém tokens.
    const blob = new Blob([JSON.stringify(portfolio.toJSON(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'seederlink-carteira.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Backup JSON preparado. Confira a pasta de downloads e guarde o arquivo em local seguro.');
  };

  const properties = portfolio.propriedades;
  return <section id="Propriedades" className="portfolio-section" aria-labelledby="portfolio-title">
    <div className="portfolio-shell">
      <div className="portfolio-heading"><span className="portfolio-eyebrow">FASE 6 · NOVA FUNCIONALIDADE</span>
        <h2 id="portfolio-title" ref={titleRef} tabIndex={-1}>Sua carteira de propriedades</h2>
        <p>Transforme uma consulta no mapa em um registro que você pode revisitar. Cadastre a propriedade, acompanhe as análises e compare os indicadores com clareza.</p>
      </div>
      <ol className="portfolio-steps"><li><b>1</b> Consulte o mapa</li><li><b>2</b> Salve a propriedade</li><li><b>3</b> Compare duas análises</li></ol>
      <p className="portfolio-local-note">Os dados ficam somente neste navegador e neste endereço do site, sem conta ou sincronização. Limpar os dados do navegador remove a carteira. Evite dispositivos compartilhados e exporte seu backup.</p>

      {storageError && <div className="portfolio-error" role="alert"><strong>Não foi possível abrir ou atualizar o armazenamento.</strong><p>{storageError}</p><p>Não apagamos seus dados. Confira as permissões do navegador e recarregue a página.</p></div>}
      <div className="portfolio-announcement" aria-live="polite" role="status">{message}</div>
      {error && <p className="portfolio-error" role="alert">{error}</p>}

      <div className="portfolio-capture">
        <div>
          <h3>Guardar uma análise</h3>
          {analysisToSave ? <>
            <p><strong>Ponto recebido do mapa:</strong><br />Latitude {number(analysisToSave.result.latitude, 5)} · Longitude {number(analysisToSave.result.longitude, 5)}</p>
            <p className="portfolio-meta">{analysisToSave.result.historical.provider} · {period(analysisToSave.result)}</p>
            <p>Esta é uma fotografia da consulta. Mover o marcador não modifica um registro salvo. Para escolher outra análise, volte ao mapa e use novamente o botão de salvar.</p>
          </> : <p>Selecione um ponto no mapa, espere a consulta terminar e clique em <strong>“Salvar esta análise na carteira”</strong>.</p>}
          <a className="portfolio-secondary" href="#Contato">Ir para o mapa</a>
        </div>
        <form onSubmit={saveProperty} className="portfolio-form" aria-label="Cadastro de propriedade">
          <fieldset disabled={!analysisToSave || Boolean(storageError)}>
            <legend>{analysisToSave ? 'Complete o registro' : 'Aguardando uma análise do mapa'}</legend>
            <label>Destino da análise<select aria-label="Destino da análise" value={draft.existingId} onChange={e => setDraft({ ...draft, existingId: e.target.value })}>
              <option value="">Cadastrar nova propriedade</option>
              {properties.map(p => <option key={p.id} value={p.id}>Atualizar histórico: {p.nome}</option>)}
            </select></label>
            {!draft.existingId ? <>
              <label>Nome da propriedade<input name="propertyName" value={draft.nome} onChange={e => setDraft({ ...draft, nome: e.target.value })} required maxLength={80} placeholder="Ex.: Sítio Boa Esperança" autoComplete="off" /></label>
              <div className="portfolio-form-row">
                <label>Cultura<select aria-label="Cultura" value={draft.cultura} onChange={e => setDraft({ ...draft, cultura: e.target.value })}><option value="soja">Soja</option><option value="tomate">Tomate</option></select></label>
                <label>Área (hectares)<input name="propertyArea" value={draft.areaHectares} onChange={e => setDraft({ ...draft, areaHectares: e.target.value })} required inputMode="decimal" maxLength={16} placeholder="Ex.: 25,5" /></label>
              </div>
              <small>Área e cultura organizam o cadastro; não alteram a triagem climática.</small>
            </> : <p>O histórico aceita somente a mesma coordenada do cadastro e mantém as 5 consultas mais recentes. Copie as coordenadas do cartão para o mapa antes de consultar novamente.</p>}
            <button className="portfolio-primary" type="submit">{draft.existingId ? 'Adicionar ao histórico' : 'Salvar propriedade'}</button>
          </fieldset>
        </form>
      </div>

      <div className="portfolio-toolbar"><div><h3>Propriedades salvas</h3><p>{properties.length} de 10 cadastros · {selected.length} de 2 selecionados</p></div>
        <div className="portfolio-actions"><button type="button" className="portfolio-secondary" disabled={!properties.length} onClick={exportPortfolio}>Exportar JSON</button>
          <button type="button" className="portfolio-primary" disabled={selected.length !== 2} onClick={compare}>Comparar selecionadas</button></div>
      </div>
      {!properties.length && <div className="portfolio-empty"><span aria-hidden="true">🌱</span><h3>Sua primeira propriedade começa no mapa</h3><p>Nenhum cadastro salvo ainda. Uma análise concluída é o primeiro passo.</p></div>}
      <div className="portfolio-grid">{properties.map(property => <article className="portfolio-card" key={property.id} data-testid="property-card">
        <div className="portfolio-card-heading"><span className="portfolio-culture">{culture(property.cultura)}</span><span>{number(property.areaHectares, 2)} ha</span></div>
        <h4>{property.nome}</h4>
        <p className="portfolio-meta">Lat. {number(property.localizacao.latitude, 5)} · Long. {number(property.localizacao.longitude, 5)}</p>
        <AnalysisSummary analysis={property.resumo()} />
        <details className="portfolio-history"><summary>Histórico · {property.analises.length} de 5 consultas</summary>
          <p>As consultas mais antigas são substituídas quando o limite de cinco é atingido.</p>
          {[...property.analises].reverse().map((analysis, index) => <div key={`${analysis.consultedAt}-${index}`}><strong>Registro {property.analises.length - index}</strong><AnalysisSummary analysis={analysis} /></div>)}
        </details>
        <div className="portfolio-card-actions"><label><input type="checkbox" checked={selected.includes(property.id)} disabled={!selected.includes(property.id) && selected.length === 2} onChange={e => {
          setSelected(previous => e.target.checked ? [...previous, property.id] : previous.filter(id => id !== property.id));
          setComparison(null);
        }} /> Comparar {property.nome}</label>
          <button className="portfolio-remove" type="button" disabled={Boolean(storageError)} onClick={() => setRemovingId(property.id)} aria-label={`Remover ${property.nome}`}>Remover</button></div>
        {removingId === property.id && <div className="portfolio-confirm" role="group" aria-label={`Confirmar remoção de ${property.nome}`}>
          <p>Remover <strong>{property.nome}</strong> e seu histórico deste navegador? Exporte um backup antes se precisar guardar os registros.</p>
          <button className="portfolio-remove" type="button" onClick={() => removeProperty(property.id)}>Confirmar remoção</button>
          <button className="portfolio-secondary" type="button" onClick={() => setRemovingId(null)}>Cancelar</button>
        </div>}
      </article>)}</div>
      {comparison && <Comparison comparison={comparison} />}
      <p className="portfolio-footnote">Os resultados são acadêmicos e indicativos. A comparação não substitui análise agronômica, vistoria ou decisão financeira. Dados salvos não são atualizados automaticamente.</p>
      <a className="portfolio-diagram-link" href={`${import.meta.env.BASE_URL}docs/diagrama-classes-fase6.png`} target="_blank" rel="noopener noreferrer">Ver diagrama de classes da Fase 6 ↗</a>
    </div>
  </section>;
}
