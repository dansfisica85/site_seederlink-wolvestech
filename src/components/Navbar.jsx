import React, { useState, useEffect } from 'react';

// A barra de navegação usa links internos e muda de aparência depois da rolagem.
export default function Navbar() {
  // Este estado indica se a página já passou dos primeiros 50 pixels.
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Eu transformo a posição atual da página em um estado simples do React.
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Removo o evento quando o componente é desmontado.
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <nav className={isScrolled ? 'nav-scroll' : ''}>
        <div className="logo">SeederLink</div>
        <ul>
          <li>
            <a href="#Home">Home</a>
          </li>
          <li>
            <a href="#SobreNos">Sobre Nós</a>
          </li>
          <li>
            <a href="#ComoFunciona">Como Funciona</a>
          </li>
          <li>
            <a href="#Plataforma">Plataforma</a>
          </li>
          <li>
            <a href="#Contato">Contato</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
