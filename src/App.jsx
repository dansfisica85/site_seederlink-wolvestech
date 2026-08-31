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

export default function App() {
  const [popupData, setPopupData] = useState({
    isOpen: false,
    mensagem: '',
  });

  useScrollAnimation();

  const handleOpenPopup = (mensagem) => {
    setPopupData({
      isOpen: true,
      mensagem,
    });
  };

  const handleClosePopup = () => {
    setPopupData((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return (
    <div className="app">
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
      <GuiaInterativo />
    </div>
  );
}
