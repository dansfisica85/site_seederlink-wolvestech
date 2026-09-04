import React, { useState } from 'react';
import MapaClimatico from './MapaClimatico';

// Esta seção reúne as informações de contato, o novo mapa e o formulário.
export default function Contato() {
  // Eu mantenho os campos controlados pelo React para validar enquanto são digitados.
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: '',
  });

  // Este estado evita mostrar avisos antes que o usuário toque em cada campo.
  const [touched, setTouched] = useState({
    nome: false,
    email: false,
    telefone: false,
    mensagem: false,
  });

  // A confirmação abaixo é apenas visual: este protótipo não envia dados a um servidor.
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Aqui eu valido se foram informados nome e sobrenome com tamanho mínimo.
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

  // Aqui eu valido o formato básico do e-mail.
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

  // Eu retiro caracteres extras, limito a 11 dígitos e aplico a máscara brasileira.
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

  // A mensagem é obrigatória e pode ter até 500 caracteres.
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

  // Recalculo todos os estados a cada alteração para habilitar o botão somente
  // quando os quatro campos estão válidos ao mesmo tempo.
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

  // Cada manipulador atualiza somente seu campo e marca que ele já foi tocado.
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

  // Este envio simulado mostra a confirmação e limpa o formulário válido.
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
      <div className="contato-shell">
        <div className="section-top fade-in">
          <span className="section-tag">Contato</span>

          <h2>Fale Conosco</h2>

          <p>
            Entre em contato e conheça as possibilidades para sua propriedade.
          </p>
        </div>

        {/* Estes dados são fictícios e servem somente para apresentar o projeto. */}
        <div
          className="contato-details-grid fade-in"
          aria-label="Canais demonstrativos de atendimento"
        >
          <article className="info-card contact-detail-card contact-detail-email">
            <span className="contact-detail-icon" aria-hidden="true">
              <i className="bi bi-envelope"></i>
            </span>
            <div>
              <span className="contact-detail-label">E-mail</span>
              <strong>contato@seederlink.example</strong>
              <small>Dado demonstrativo</small>
            </div>
          </article>

          <article className="info-card contact-detail-card contact-detail-phone">
            <span className="contact-detail-icon" aria-hidden="true">
              <i className="bi bi-telephone"></i>
            </span>
            <div>
              <span className="contact-detail-label">Telefone</span>
              <strong>(11) 90000-0000</strong>
              <small>Dado demonstrativo</small>
            </div>
          </article>

          <article className="info-card contact-detail-card contact-detail-service">
            <span className="contact-detail-icon" aria-hidden="true">
              <i className="bi bi-headset"></i>
            </span>
            <div>
              <span className="contact-detail-label">Atendimento remoto</span>
              <strong>Segunda a sexta</strong>
              <small>Das 9h às 17h</small>
            </div>
          </article>
        </div>

        <div className="contato-workspace">
          {/* O formulário ocupa a coluna menor e permanece alinhado ao início do mapa. */}
          <form
            className="contato-form slide-left"
            onSubmit={handleSubmit}
            aria-labelledby="contato-form-title"
          >
            <div className="contato-form-heading">
              <span>Mensagem</span>
              <h3 id="contato-form-title">Conte sobre sua propriedade</h3>
              <p>
                Preencha os campos abaixo para que nossa equipe possa retornar o
                contato.
              </p>
            </div>

            <div className="contato-form-field">
              <label htmlFor="contato-nome">Nome e sobrenome</label>
              <input
                id="contato-nome"
                name="nome"
                type="text"
                placeholder="Ex.: Maria da Silva"
                autoComplete="name"
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

            <div className="contato-form-field">
              <label htmlFor="contato-email">Seu e-mail</label>
              <input
                id="contato-email"
                name="email"
                type="email"
                placeholder="nome@exemplo.com"
                autoComplete="email"
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

            <div className="contato-form-field">
              <label htmlFor="contato-telefone">Celular com DDD</label>
              <input
                id="contato-telefone"
                name="telefone"
                type="tel"
                placeholder="(DDD) 9 9999-9999"
                autoComplete="tel"
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

            <div className="contato-form-field">
              <div className="contato-field-heading">
                <label htmlFor="contato-mensagem">Mensagem</label>
                <small>{formData.mensagem.length}/500</small>
              </div>
              <textarea
                id="contato-mensagem"
                name="mensagem"
                  rows={6}
                  maxLength={500}
                placeholder="Conte brevemente o que você produz e qual apoio procura."
                value={formData.mensagem}
                onChange={handleMensagemChange}
                required
              ></textarea>
              {touched.mensagem && (
                <small className={mensagemStatus.erro ? 'erro-msg' : 'sucesso-msg'}>
                  {mensagemStatus.msg}
                </small>
              )}
            </div>

            <button type="submit" disabled={!isFormValid}>
              Enviar mensagem
            </button>

            {formSubmitted && (
              <small className="mensagem-sucesso" role="status">
                Mensagem enviada com sucesso!
              </small>
            )}
          </form>

          {/* O mapa recebe mais espaço porque concentra a análise da propriedade. */}
          <MapaClimatico />
        </div>
      </div>
    </section>
  );
}
