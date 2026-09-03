import React from 'react';

export default function Hero() {
  return (
    <section
      id="Home"
      style={{
        '--hero-image': `url("${import.meta.env.BASE_URL}img/agro_header.jpg")`,
      }}
    >
      <div className="home-content">
        {/* LEFT */}
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

          {/* PITCH VÍDEO */}
          <a
            href="https://youtu.be/bRALz0SSVh0?si=8o290JzSlp8dHbQC"
            target="_blank"
            rel="noopener noreferrer"
            className="pitch-link fade-in"
          >
            <span className="play-icon">
              <i className="bi bi-youtube"></i>
            </span>

            <div>
              <strong>
                Assistir Pitch do Projeto
              </strong>
              <p>Conheça o site da SeederLink!</p>
            </div>
          </a>
        </div>

        {/* RIGHT */}
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
