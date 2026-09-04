import React from 'react';

// Aqui eu conto a proposta da SeederLink e separo missão, visão e valores em cards.
export default function SobreNos() {
  // BASE_URL evita caminhos quebrados quando o site é publicado em uma subpasta.
  const imageBaseUrl = `${import.meta.env.BASE_URL}img/`;

  return (
    <section id="SobreNos">
      <div className="sobre-container">
        <div className="sobre-texto fade-in">
          <span className="section-tag">
            Nossa História
          </span>

          <h2>
            Tecnologia para transformar o agronegócio sustentável
          </h2>

          <p>
            A SeederLink nasceu para conectar o campo ao capital.
            Criada em ambiente acadêmico, evoluiu como solução
            tecnológica para apoiar pequenos agricultores,
            reduzir desperdícios e aproximar investidores de impacto.
          </p>
        </div>

        <div className="sobre-cards">
          <div className="sobre-card zoom-in">
            <img src={`${imageBaseUrl}alvo.png`} alt="Missão" />
            <h3>Missão</h3>
            <p>
              Facilitar crédito justo e reduzir a fome.
            </p>
          </div>

          <div className="sobre-card zoom-in">
            <img src={`${imageBaseUrl}visao.png`} alt="Visão" />
            <h3>Visão</h3>
            <p>
              Ser referência em soluções digitais sustentáveis.
            </p>
          </div>

          <div className="sobre-card zoom-in">
            <img src={`${imageBaseUrl}valores.png`} alt="Valores" />
            <h3>Valores</h3>
            <p>
              Transparência, inclusão e sustentabilidade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
