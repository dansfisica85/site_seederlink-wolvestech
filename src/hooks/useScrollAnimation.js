import { useEffect } from 'react';

export function useScrollAnimation() {
  useEffect(() => {
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

    // Re-observar caso o DOM mude dinamicamente
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
