import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SobreNos from './components/SobreNos';
import ComoFunciona from './components/ComoFunciona';
import Plataforma from './components/Plataforma';
import Contato from './components/Contato';
import Footer from './components/Footer';
import PopupContato from './components/PopupContato';
import GuiaInterativo from './components/GuiaInterativo';
import { useScrollAnimation } from './hooks/useScrollAnimation';

// Este é o componente principal: ele organiza todas as seções na ordem em que
// aparecem na página e mantém o estado compartilhado do popup de contato.
export default function App() {
  // Eu guardo juntos o estado de abertura e a mensagem exibida pelo popup.
  const [popupData, setPopupData] = useState({
    isOpen: false,
    mensagem: '',
  });

  // Este hook observa os elementos e aplica as animações quando entram na tela.
  useScrollAnimation();

  // A Plataforma chama esta função para abrir o popup com a mensagem adequada.
  const handleOpenPopup = (mensagem) => {
    setPopupData({
      isOpen: true,
      mensagem,
    });
  };

  // Ao fechar, preservo a mensagem e altero somente o estado de abertura.
  const handleClosePopup = () => {
    setPopupData((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return (
    <div className="app">
      {/* Aqui eu reúno os componentes que formam a página de uma única rota. */}
      <Navbar />
      <main>
        <Hero />
        <SobreNos />
        <ComoFunciona />
        <Plataforma onOpenPopup={handleOpenPopup} />
        <Contato />
      </main>
      <Footer />
      <PopupContato
        isOpen={popupData.isOpen}
        mensagem={popupData.mensagem}
        onClose={handleClosePopup}
      />
      {/* O guia fica no final porque suas dicas podem apontar para toda a página. */}
      <GuiaInterativo />
    </div>
  );
}
