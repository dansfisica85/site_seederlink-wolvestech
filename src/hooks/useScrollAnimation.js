import { useEffect } from 'react';

// Eu concentrei a animação de rolagem neste hook para poder usá-la no App sem
// repetir a mesma lógica dentro de cada seção.
export function useScrollAnimation() {
  useEffect(() => {
    // O IntersectionObserver informa quando cada elemento entra ou sai da tela.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    const observeElements = () => {
      const elementos = document.querySelectorAll(
        '.fade-in, .slide-left, .slide-right, .zoom-in, .bar'
      );
      elementos.forEach((el) => observer.observe(el));
    };

    observeElements();

    // Eu observo mudanças no DOM porque alguns cards aparecem depois de cliques.
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      // Desligo os dois observadores quando o App sai da tela para evitar vazamentos.
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
