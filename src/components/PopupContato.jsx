import React, { useEffect, useRef } from 'react';

export default function PopupContato({ isOpen, mensagem, onClose }) {
  const okBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Foca no botão OK quando o modal abre
      setTimeout(() => {
        okBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      const contatoSection = document.querySelector('#Contato');
      if (contatoSection) {
        contatoSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 180);
  };

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
