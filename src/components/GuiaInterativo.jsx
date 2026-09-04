import React, { useEffect, useRef, useState } from 'react';
import { orientacoesGuia } from '../data/guiaOrientacoes';

// Este componente cria um balão e uma seta que explicam os elementos da página.
export default function GuiaInterativo() {
  // Guardo os elementos visuais em referências e o texto atual em um estado.
  const tooltipRef = useRef(null);
  const arrowRef = useRef(null);
  const [orientacaoAtiva, setOrientacaoAtiva] = useState(null);

  useEffect(() => {
    const tooltip = tooltipRef.current;
    const arrow = arrowRef.current;
    if (!tooltip || !arrow) return;

    // Procuro a primeira orientação cujo seletor combina com o elemento apontado.
    function obterOrientacao(elemento) {
      for (let i = 0; i < orientacoesGuia.length; i++) {
        if (elemento.matches(orientacoesGuia[i].seletor)) {
          return orientacoesGuia[i];
        }
      }
      return null;
    }

    // Calculo um local onde balão e seta caibam na tela sem cobrir o alvo.
    function posicionar(elemento) {
      const margem = 16;
      const espacoSetaVertical = 100;
      const setaLargura = 92;
      const setaAltura = 48;
      const setaRotacionadaAltura = 92;
      const rect = elemento.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const largura = tooltipRect.width || 320;
      const altura = tooltipRect.height || 120;

      // Primeiro tento centralizar o balão acima do elemento.
      let left = rect.left + rect.width / 2 - largura / 2;
      left = Math.max(margem, Math.min(left, window.innerWidth - largura - margem));

      let top = rect.top - altura - espacoSetaVertical;
      let setaClasse = 'baixo';

      if (top < margem) {
        // Se não houver espaço em cima, mostro o balão abaixo.
        top = rect.bottom + 100;
        setaClasse = 'cima';
      }

      if (top + altura > window.innerHeight - margem) {
        // Se também faltar espaço vertical, tento o lado direito e depois o esquerdo.
        top = Math.max(margem, rect.top + rect.height / 2 - altura / 2);
        left = rect.right + 94;
        setaClasse = 'esquerda';

        if (left + largura > window.innerWidth - margem) {
          left = rect.left - largura - 94;
          setaClasse = 'direita';
        }
      }

      // Estes limites impedem que o balão saia da janela do navegador.
      const tooltipLeft = Math.max(
        margem,
        Math.min(left, window.innerWidth - largura - margem)
      );
      const tooltipTop = Math.max(
        margem,
        Math.min(top, window.innerHeight - altura - margem)
      );

      tooltip.style.left = `${tooltipLeft}px`;
      tooltip.style.top = `${tooltipTop}px`;

      // Depois de posicionar o balão, ajusto a seta para apontar ao elemento.
      let setaLeft = rect.left + rect.width / 2 - setaLargura / 2;
      let setaTop = 0;

      if (setaClasse === 'baixo') {
        setaLeft = Math.max(
          tooltipLeft + 16,
          Math.min(setaLeft, tooltipLeft + largura - setaLargura - 16)
        );
        setaTop = tooltipTop + altura + (setaRotacionadaAltura - setaAltura) / 2;
      } else if (setaClasse === 'cima') {
        setaLeft = Math.max(
          tooltipLeft + 16,
          Math.min(setaLeft, tooltipLeft + largura - setaLargura - 16)
        );
        setaTop =
          tooltipTop - setaRotacionadaAltura + (setaRotacionadaAltura - setaAltura) / 2;
      } else if (setaClasse === 'esquerda') {
        setaLeft = tooltipLeft - setaLargura;
        setaTop = Math.max(
          tooltipTop + 12,
          Math.min(
            rect.top + rect.height / 2 - setaAltura / 2,
            tooltipTop + altura - setaAltura - 12
          )
        );
      } else if (setaClasse === 'direita') {
        setaLeft = tooltipLeft + largura;
        setaTop = Math.max(
          tooltipTop + 12,
          Math.min(
            rect.top + rect.height / 2 - setaAltura / 2,
            tooltipTop + altura - setaAltura - 12
          )
        );
      }

      arrow.className = `guia-seta ${setaClasse} ativo`;
      arrow.style.left = `${Math.max(8, Math.min(setaLeft, window.innerWidth - 100))}px`;
      arrow.style.top = `${Math.max(8, Math.min(setaTop, window.innerHeight - 58))}px`;
    }

    // Ao entrar com mouse ou foco, carrego o texto e mostro a orientação.
    function mostrarGuia(evento) {
      const orientacao = obterOrientacao(evento.currentTarget);
      if (!orientacao) return;

      setOrientacaoAtiva(orientacao);
      tooltip.classList.add('ativo');
      posicionar(evento.currentTarget);
    }

    // Ao sair, escondo os dois elementos visuais.
    function esconderGuia() {
      tooltip.classList.remove('ativo');
      arrow.className = 'guia-seta';
    }

    // Eu conecto mouse e teclado a todos os seletores cadastrados.
    function ativarGuias() {
      orientacoesGuia.forEach((orientacao) => {
        const elementos = document.querySelectorAll(orientacao.seletor);

        elementos.forEach((elemento) => {
          // Esta marca evita registrar os mesmos eventos mais de uma vez.
          if (elemento.dataset.guiaAtivo === 'true') {
            return;
          }

          elemento.dataset.guiaAtivo = 'true';
          elemento.addEventListener('mouseenter', mostrarGuia);
          elemento.addEventListener('mouseleave', esconderGuia);
          elemento.addEventListener('focus', mostrarGuia);
          elemento.addEventListener('blur', esconderGuia);
        });
      });
    }

    ativarGuias();
    window.addEventListener('resize', esconderGuia);
    window.addEventListener('scroll', esconderGuia, { passive: true });

    // Novos cards podem surgir depois de uma escolha, então observo mudanças no DOM.
    const observadorGuia = new MutationObserver(ativarGuias);
    observadorGuia.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      // Retiro observadores e eventos globais quando o componente é desmontado.
      window.removeEventListener('resize', esconderGuia);
      window.removeEventListener('scroll', esconderGuia);
      observadorGuia.disconnect();
    };
  }, []);

  return (
    <>
      {/* aria-live anuncia a orientação atual sem interromper a navegação. */}
      <div
        ref={tooltipRef}
        className="guia-tooltip"
        role="status"
        aria-live="polite"
      >
        {orientacaoAtiva && (
          <>
            <h4>{orientacaoAtiva.titulo}</h4>
            <p>{orientacaoAtiva.texto}</p>
          </>
        )}
      </div>
      {/* A posição e a direção desta seta são preenchidas pelo efeito acima. */}
      <div ref={arrowRef} className="guia-seta"></div>
    </>
  );
}
