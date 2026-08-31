import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
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
