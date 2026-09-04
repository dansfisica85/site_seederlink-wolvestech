import React, { useState } from 'react';
import { parceirosLista, dadosParceiros } from '../data/parceiros';

// Nesta seção eu simulo a busca de produtores e investidores cadastrados.
export default function Plataforma({ onOpenPopup }) {
  // Estes estados guardam cada escolha e controlam o que aparece na tela.
  const [perfilSelecionado, setPerfilSelecionado] = useState('');
  const [estado, setEstado] = useState('');
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const [parceirosEncontrados, setParceirosEncontrados] = useState([]);
  const [parceiroAtivo, setParceiroAtivo] = useState(null);
  const [infoParceiro, setInfoParceiro] = useState(null);

  // Ao trocar o perfil, eu limpo a busca anterior para não misturar resultados.
  const selecionarPerfil = (tipo) => {
    setPerfilSelecionado(tipo);
    setBuscaRealizada(false);
    setParceirosEncontrados([]);
    setParceiroAtivo(null);
    setInfoParceiro(null);
  };

  // Eu filtro a lista pelo estado e pelo perfil escolhidos pelo usuário.
  const buscarParceiros = () => {
    setBuscaRealizada(true);
    setParceiroAtivo(null);
    setInfoParceiro(null);

    if (estado === '') {
      setParceirosEncontrados([]);
      return;
    }

    const encontrados = parceirosLista
      .filter(
        (p) => p.includes(estado) && p.includes(perfilSelecionado)
      )
      .map((p) => p.split(' - ')[0]);

    setParceirosEncontrados(encontrados);
  };

  // Quando um nome é escolhido, busco os detalhes no objeto dadosParceiros.
  const selecionarParceiro = (nome) => {
    setParceiroAtivo(nome);
    const dados = dadosParceiros[nome];
    if (dados) {
      setInfoParceiro(dados);
    }
  };

  // Esta ação pede ao App que abra o popup compartilhado.
  const handleSeguirProcesso = () => {
    onOpenPopup(
      'Para seguir com o processo, precisamos que você informe seus dados na seção de Contato.'
    );
  };

  return (
    <section id="Plataforma">
      <div className="section-top white fade-in">
        <span className="section-tag dark">Plataforma Inteligente</span>
        <h2>Tecnologia aplicada ao impacto social</h2>
        <p>
          Inteligência artificial, rastreabilidade e inclusão digital
          impulsionando o agronegócio sustentável.
        </p>
      </div>

      <div className="plataforma-grid">
        {/* Este card recebe as escolhas usadas na busca simulada de parceiros. */}
        <div
          className={`feature-card localizador ${infoParceiro ? 'move-left' : ''}`}
          id="localizador"
        >
          <h3>Localizador de Parceiros</h3>
          <p>Selecione o perfil do parceiro:</p>

          <div className="perfil-cards">
            <div
              className={`perfil-card ${perfilSelecionado === 'produtor' ? 'ativo' : ''}`}
              onClick={() => selecionarPerfil('produtor')}
            >
              🌱 <strong>Produtor Rural</strong>
            </div>
            <div
              className={`perfil-card ${perfilSelecionado === 'investidor' ? 'ativo' : ''}`}
              onClick={() => selecionarPerfil('investidor')}
            >
              💰 <strong>Investidor</strong>
            </div>
          </div>

          {/* Eu só mostro o estado depois que o perfil foi escolhido. */}
          {perfilSelecionado && (
            <div id="estado-container" style={{ marginTop: '20px' }}>
              <p>Agora selecione o estado desejado:</p>
              <div className="estado-busca">
                <select
                  id="estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value="">Selecione o estado desejado</option>
                  <option value="SP">São Paulo</option>
                  <option value="MG">Minas Gerais</option>
                </select>
                <button onClick={buscarParceiros}>Buscar</button>
              </div>
            </div>
          )}

          {/* Estes blocos são renderizados de acordo com o resultado da busca. */}
          <div id="resultado">
            {buscaRealizada && estado === '' && (
              <p>Por favor, selecione um estado.</p>
            )}

            {buscaRealizada && estado !== '' && parceirosEncontrados.length === 0 && (
              <p>Nenhum parceiro encontrado.</p>
            )}

            {parceirosEncontrados.map((nome) => (
              <React.Fragment key={nome}>
                <p
                  className={`parceiro-opcao ${parceiroAtivo === nome ? 'ativo' : ''}`}
                  onClick={() => selecionarParceiro(nome)}
                >
                  {nome}
                </p>
                {parceiroAtivo === nome && (
                  <button
                    id="seguir-processo-btn"
                    style={{
                      marginTop: '15px',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      background: '#2E7D32',
                      color: 'white',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: '0.3s ease',
                      display: 'block'
                    }}
                    onClick={handleSeguirProcesso}
                  >
                    Seguir com o processo
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Os detalhes aparecem somente quando um parceiro é selecionado. */}
        <div className={`features ${infoParceiro ? 'show' : ''}`} id="cards-info">
          <div className={`feature-card ${infoParceiro ? 'visible' : ''}`} id="card1">
            {infoParceiro && (
              <>
                <h3>Tempo de Mercado</h3>
                <p>{infoParceiro.tempo}</p>
              </>
            )}
          </div>
          <div className={`feature-card ${infoParceiro ? 'visible' : ''}`} id="card2">
            {infoParceiro && (
              <>
                <h3>Foco Principal</h3>
                <p>{infoParceiro.foco}</p>
              </>
            )}
          </div>
          <div className={`feature-card ${infoParceiro ? 'visible' : ''}`} id="card3">
            {infoParceiro && (
              <>
                <h3>Objetivo Atual</h3>
                <p>{infoParceiro.objetivo}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
