import React, { useEffect, useRef } from 'react';

// Este popup orienta o usuário a continuar pelo formulário de contato.
export default function PopupContato({ isOpen, mensagem, onClose }) {
  // A referência me permite enviar o foco ao botão sem procurar o elemento no DOM.
  const okBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Eu foco o botão OK para facilitar o uso por teclado e leitor de tela.
      setTimeout(() => {
        okBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Fecho o popup e, depois da animação, levo o usuário até o contato.
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      const contatoSection = document.querySelector('#Contato');
      if (contatoSection) {
        contatoSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 180);
  };

  // O clique no fundo fecha o popup; o clique dentro do cartão não fecha.
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="popup-contato-overlay ativo"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-contato-titulo"
    >
      <div className="popup-contato-card">
        <button
          className="popup-contato-fechar"
          type="button"
          aria-label="Fechar aviso"
          onClick={handleClose}
        >
          ×
        </button>
        <div className="popup-contato-icone">🌱</div>
        <h3 id="popup-contato-titulo">Próximo passo</h3>
        <p>{mensagem}</p>
        <button
          ref={okBtnRef}
          className="popup-contato-ok"
          type="button"
          onClick={handleClose}
        >
          Ok
        </button>
      </div>
    </div>
  );
}
