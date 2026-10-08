import React from 'react';
import { ENTREGA } from '../data/entrega';

// Esta é a primeira seção do site: apresenta a proposta, os atalhos e o pitch.
export default function Hero() {
  return (
    <section
      id="Home"
      style={{
        '--hero-image': `url("${import.meta.env.BASE_URL}img/agro_header.jpg")`,
      }}
    >
      <div className="home-content">
        {/* No lado esquerdo eu concentro a apresentação e as ações principais. */}
        <div className="home-left slide-left">
          <span className="tag-home">
            Agro • ESG • Tecnologia
          </span>

          <h1>
            Conectando o campo ao capital sustentável
          </h1>

          <p>
            A SeederLink aproxima investidores de impacto
            e produtores rurais através de uma plataforma
            transparente, inteligente e socialmente responsável.
          </p>

          <div className="home-buttons">
            <a href="#ComoFunciona" className="btn-home">
              Saiba Mais
            </a>

            <a href="#Contato" className="btn-outline">
              Fale Conosco
            </a>
          </div>

          <a className="portfolio-home-link" href="#Propriedades">Novidade da Fase 6: Carteira de Propriedades →</a>
          {/* Eu só anuncio o pitch da Fase 6 quando seu link público estiver configurado. */}
          <a
            href={ENTREGA.pitchUrl || ENTREGA.pitchAnteriorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pitch-link fade-in"
          >
            <span className="play-icon">
              <i className="bi bi-youtube"></i>
            </span>

            <div>
              <strong>
                {ENTREGA.pitchUrl ? 'Assistir Pitch — Fase 6' : 'Apresentação anterior — Fase 5'}
              </strong>
              <p>{ENTREGA.pitchUrl ? 'Conheça a carteira e o modelo de classes.' : 'A análise climática que serviu de base para esta versão.'}</p>
            </div>
          </a>
          {!ENTREGA.pitchUrl && <p className="portfolio-pitch-pending">Pitch da Fase 6: aguardando publicação do vídeo.</p>}
        </div>

        {/* No lado direito eu resumo quatro benefícios do projeto. */}
        <div className="home-right slide-right">
          <div className="home-card fade-in">
            <span>✔</span>
            <div>
              <h3>Crédito Rural Inteligente</h3>
              <p>Financiamento sustentável com tecnologia.</p>
            </div>
          </div>

          <div className="home-card fade-in">
            <span>✔</span>
            <div>
              <h3>Investimento de Impacto</h3>
              <p>Retorno financeiro aliado ao impacto social.</p>
            </div>
          </div>

          <div className="home-card fade-in">
            <span>✔</span>
            <div>
              <h3>Transparência Total</h3>
              <p>Rastreabilidade em toda cadeia produtiva.</p>
            </div>
          </div>

          <div className="home-card fade-in">
            <span>✔</span>
            <div>
              <h3>Conexão Direta</h3>
              <p>Investidores conectados diretamente ao produtor.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
