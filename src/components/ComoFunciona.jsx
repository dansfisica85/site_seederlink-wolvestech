import React from 'react';

export default function ComoFunciona() {
  return (
    <section id="ComoFunciona">
      <div className="section-top fade-in">
        <span className="section-tag">
          Fluxo Inteligente
        </span>

        <h2>
          Como funciona?
        </h2>

        <p>
          Conectamos investidores de impacto a produtores rurais
          através de tecnologia, rastreabilidade e inclusão financeira.
        </p>
      </div>

      <div className="timeline">
        <div className="timeline-card fade-in">
          <div className="numero">1</div>
          <img src="/img/investidor.png" alt="Investidor" />
          <h3>Investidor</h3>
          <p>
            Define investimentos e acompanha impacto financeiro e social.
          </p>
        </div>

        <div className="timeline-card fade-in">
          <div className="numero">2</div>
          <img src="/img/plataforma.png" alt="Plataforma" />
          <h3>Plataforma</h3>
          <p>
            IA conecta investidores aos produtores ideais.
          </p>
        </div>

        <div className="timeline-card fade-in">
          <div className="numero">3</div>
          <img src="/img/produtor.png" alt="Produtor" />
          <h3>Produtor Rural</h3>
          <p>
            Recebe crédito e amplia sua produção sustentável.
          </p>
        </div>
      </div>
    </section>
  );
}
