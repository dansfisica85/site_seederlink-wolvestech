import React, { useState } from 'react';
import MapaClimatico from './MapaClimatico';

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: '',
  });

  const [touched, setTouched] = useState({
    nome: false,
    email: false,
    telefone: false,
    mensagem: false,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  // Validação do Nome
  const getNomeStatus = (valor) => {
    const trimmed = valor.trim();
    if (trimmed === '') {
      return { valido: false, msg: '*Campo Obrigatório.', erro: true };
    }
    const partes = trimmed.split(' ');
    if (partes.length < 2) {
      return { valido: false, msg: 'Digite nome e sobrenome.', erro: true };
    }
    if (partes.some((p) => p.length < 2)) {
      return {
        valido: false,
        msg: 'Nome e Sobrenome devem ter pelo menos 2 letras.',
        erro: true,
      };
    }
    return { valido: true, msg: 'Informação válida ✓', erro: false };
  };

  // Validação do Email
  const getEmailStatus = (valor) => {
    const trimmed = valor.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (trimmed === '') {
      return { valido: false, msg: '*Campo Obrigatório.', erro: true };
    }
    if (!regex.test(trimmed)) {
      return { valido: false, msg: 'Digite um email válido.', erro: true };
    }
    return { valido: true, msg: 'Informação válida ✓', erro: false };
  };

  // Formatação e Validação do Telefone
  const formatTelefone = (inputVal) => {
    let valor = inputVal.replace(/\D/g, '').slice(0, 11);
    let formatado = valor;

    if (valor.length > 0) {
      if (valor.length <= 2) {
        formatado = `(${valor}`;
      } else if (valor.length <= 3) {
        formatado = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
      } else if (valor.length <= 7) {
        formatado = `(${valor.slice(0, 2)}) ${valor.slice(2, 3)} ${valor.slice(3)}`;
      } else {
        formatado = `(${valor.slice(0, 2)}) ${valor.slice(2, 3)} ${valor.slice(3, 7)}-${valor.slice(7)}`;
      }
    }
    return { formatado, raw: valor };
  };

  const getTelefoneStatus = (rawVal) => {
    if (rawVal === '') {
      return { valido: false, msg: '*Campo Obrigatório.', erro: true };
    }
    if (rawVal.length !== 11) {
      return {
        valido: false,
        msg: 'Digite um telefone válido com 11 dígitos (DDD + celular).',
        erro: true,
      };
    }
    if (rawVal[2] !== '9') {
      return {
        valido: false,
        msg: 'O número de celular deve começar com 9 após o DDD.',
        erro: true,
      };
    }
    return { valido: true, msg: 'Informação válida ✓', erro: false };
  };

  // Validação da Mensagem
  const getMensagemStatus = (valor) => {
    const trimmed = valor.trim();
    if (trimmed === '') {
      return { valido: false, msg: '*Campo Obrigatório.', erro: true };
    }
    if (valor.length > 500) {
      return {
        valido: false,
        msg: 'A mensagem deve ter no máximo 500 caracteres.',
        erro: true,
      };
    }
    return { valido: true, msg: 'Informação válida ✓', erro: false };
  };

  const rawTelefone = formData.telefone.replace(/\D/g, '');
  const nomeStatus = getNomeStatus(formData.nome);
  const emailStatus = getEmailStatus(formData.email);
  const telefoneStatus = getTelefoneStatus(rawTelefone);
  const mensagemStatus = getMensagemStatus(formData.mensagem);

  const isFormValid =
    nomeStatus.valido &&
    emailStatus.valido &&
    telefoneStatus.valido &&
    mensagemStatus.valido;

  const handleNomeChange = (e) => {
    setFormData((prev) => ({ ...prev, nome: e.target.value }));
    setTouched((prev) => ({ ...prev, nome: true }));
    setFormSubmitted(false);
  };

  const handleEmailChange = (e) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
    setTouched((prev) => ({ ...prev, email: true }));
    setFormSubmitted(false);
  };

  const handleTelefoneChange = (e) => {
    const { formatado } = formatTelefone(e.target.value);
    setFormData((prev) => ({ ...prev, telefone: formatado }));
    setTouched((prev) => ({ ...prev, telefone: true }));
    setFormSubmitted(false);
  };

  const handleMensagemChange = (e) => {
    setFormData((prev) => ({ ...prev, mensagem: e.target.value }));
    setTouched((prev) => ({ ...prev, mensagem: true }));
    setFormSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setFormSubmitted(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        mensagem: '',
      });
      setTouched({
        nome: false,
        email: false,
        telefone: false,
        mensagem: false,
      });
    }
  };

  return (
    <section id="Contato">
      <div className="section-top fade-in">
        <span className="section-tag">Contato</span>

        <h2>Fale Conosco</h2>

        <p>
          Entre em contato e participe da transformação sustentável.
        </p>
      </div>

      <div className="contato-grid">
        <div className="contato-info slide-left">
          <div className="info-card fade-in">
            <h3>Email</h3>
            <p>seederlink.comercial@gmail.com</p>
          </div>

          <div className="info-card fade-in">
            <h3>Telefone</h3>
            <p>(11) 97211-8003</p>
          </div>

          <MapaClimatico />
        </div>

        {/* FORMULÁRIO */}
        <form className="contato-form slide-right" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Nome e Sobrenome"
              value={formData.nome}
              onChange={handleNomeChange}
              required
            />
            {touched.nome && (
              <small className={nomeStatus.erro ? 'erro-msg' : 'sucesso-msg'}>
                {nomeStatus.msg}
              </small>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="seu-email@domínio.com"
              value={formData.email}
              onChange={handleEmailChange}
              required
            />
            {touched.email && (
              <small className={emailStatus.erro ? 'erro-msg' : 'sucesso-msg'}>
                {emailStatus.msg}
              </small>
            )}
          </div>

          <div>
            <input
              type="tel"
              placeholder="(DDD) 9 9999-9999"
              value={formData.telefone}
              onChange={handleTelefoneChange}
              required
            />
            {touched.telefone && (
              <small className={telefoneStatus.erro ? 'erro-msg' : 'sucesso-msg'}>
                {telefoneStatus.msg}
              </small>
            )}
          </div>

          <div>
            <textarea
              placeholder="Digite sua mensagem"
              value={formData.mensagem}
              onChange={handleMensagemChange}
            ></textarea>
            {touched.mensagem && (
              <small className={mensagemStatus.erro ? 'erro-msg' : 'sucesso-msg'}>
                {mensagemStatus.msg}
              </small>
            )}
          </div>

          <button type="submit" disabled={!isFormValid}>
            Enviar
          </button>

          {formSubmitted && (
            <small className="mensagem-sucesso" style={{ display: 'block' }}>
              Mensagem enviada com sucesso!
            </small>
          )}
        </form>
      </div>
    </section>
  );
}
