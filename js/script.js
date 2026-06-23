// =========================================================
// ANIMAÇÕES AO SCROLL
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    const elementos = document.querySelectorAll(
        ".fade-in, .slide-left, .slide-right, .zoom-in, .bar"
    );

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                entry.target.classList.add("visible");

            } else {

                entry.target.classList.remove("visible");
            }

        });

    }, {
        threshold: 0.15
    });

    elementos.forEach(el => observer.observe(el));

});


// =========================================================
// NAVBAR BACKGROUND AO SCROLL
// =========================================================

window.addEventListener("scroll", () => {

    const nav = document.querySelector("nav");

    if(window.scrollY > 50){

        nav.classList.add("nav-scroll");

    } else {

        nav.classList.remove("nav-scroll");
    }

});


// =========================================================
//  Lógica de Busca de Parceiros - Plataforma Inteligente
// =========================================================

var perfilSelecionado = "";

function mostrarPopupContato(mensagem) {
  var popupExistente = document.querySelector(".popup-contato-overlay");

  if (popupExistente) {
    popupExistente.remove();
  }

  var overlay = document.createElement("div");
  overlay.className = "popup-contato-overlay";
  overlay.innerHTML = `
    <div class="popup-contato-card" role="dialog" aria-modal="true" aria-labelledby="popup-contato-titulo">
      <button class="popup-contato-fechar" type="button" aria-label="Fechar aviso">×</button>
      <div class="popup-contato-icone">🌱</div>
      <h3 id="popup-contato-titulo">Próximo passo</h3>
      <p>${mensagem}</p>
      <button class="popup-contato-ok" type="button">Ok</button>
    </div>
  `;

  document.body.appendChild(overlay);

  var fecharBtn = overlay.querySelector(".popup-contato-fechar");
  var okBtn = overlay.querySelector(".popup-contato-ok");

  function fecharPopup() {
    overlay.classList.remove("ativo");

    setTimeout(() => {
      overlay.remove();
      document.querySelector("#Contato").scrollIntoView({ behavior: "smooth" });
    }, 180);
  }

  requestAnimationFrame(() => {
    overlay.classList.add("ativo");
    okBtn.focus();
  });

  fecharBtn.addEventListener("click", fecharPopup);
  okBtn.addEventListener("click", fecharPopup);
  overlay.addEventListener("click", (evento) => {
    if (evento.target === overlay) {
      fecharPopup();
    }
  });
}

function selecionarPerfil(tipo) {
  perfilSelecionado = tipo;

    // Remove destaque de todos os cards
  var cards = document.querySelectorAll(".perfil-card");
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.remove("ativo");
  }

  // Adiciona destaque ao card clicado
  var cardSelecionado = document.querySelector(
    ".perfil-card[onclick=\"selecionarPerfil('" + tipo + "')\"]"
  );
  cardSelecionado.classList.add("ativo");

  document.getElementById("estado-container").style.display = "block";
}

function buscarParceiros() {
  var estado = document.getElementById("estado").value;
  var resultado = document.getElementById("resultado");

  var parceiros = [
    "Fazenda Boa Terra - SP - produtor",
    "AgroFuturo Investimentos - SP - investidor",
    "Sítio Esperança - MG - produtor",
    "Capital Verde - MG - investidor"
  ];

  resultado.innerHTML = ""; // limpa antes de exibir

  if (estado === "") {
    resultado.innerHTML = "<p>Por favor, selecione um estado.</p>";
    return;
  }

  var encontrados = false;
  for (var i = 0; i < parceiros.length; i++) {
    if (parceiros[i].includes(estado) && parceiros[i].includes(perfilSelecionado)) {
      var nome = parceiros[i].split(" - ")[0];
      resultado.innerHTML += `<p class="parceiro-opcao" onclick="selecionarParceiro(this, '${nome}')">${nome}</p>`;
      encontrados = true;
    }
  }

  if (!encontrados) {
    resultado.innerHTML = "<p>Nenhum parceiro encontrado.</p>";
  }
}


function selecionarParceiro(elemento, nome) {
  var opcoes = document.querySelectorAll(".parceiro-opcao");
  for (var i = 0; i < opcoes.length; i++) {
    opcoes[i].classList.remove("ativo");
  }

  elemento.classList.add("ativo");
  mostrarInfo(nome);

  // Adiciona botão "Seguir com processo"
  var seguirBtn = document.createElement("button");
  seguirBtn.textContent = "Seguir com o processo";
  seguirBtn.style.marginTop = "15px";
  seguirBtn.style.padding = "12px 24px";
  seguirBtn.style.borderRadius = "10px";
  seguirBtn.style.background = "#2E7D32";
  seguirBtn.style.color = "white";
  seguirBtn.style.fontWeight = "600";
  seguirBtn.style.border = "none";
  seguirBtn.style.cursor = "pointer";
  seguirBtn.style.transition = "0.3s ease";

  // Remove botão anterior se já existir
  var existente = document.querySelector("#seguir-processo-btn");
  if (existente) {
    existente.remove();
  }
  seguirBtn.id = "seguir-processo-btn";

  elemento.insertAdjacentElement("afterend", seguirBtn);

  // Ação ao clicar no botão
  seguirBtn.addEventListener("click", () => {
    mostrarPopupContato("Para seguir com o processo, precisamos que você informe seus dados na seção de Contato.");
  });
}



// =========================================================
//  Informações de Parceiros - Plataforma Inteligente
// =========================================================

var dadosParceiros = {
  "Fazenda Boa Terra": {
    tempo: "12 anos no mercado",
    foco: "Cultivo de hortaliças orgânicas",
    objetivo: "Busca investidores para ampliar exportação"
  },
  "AgroFuturo Investimentos": {
    tempo: "8 anos de atuação",
    foco: "Investimentos em logística agro",
    objetivo: "Procura produtores para parceria em transporte"
  },
  "Sítio Esperança": {
    tempo: "15 anos no mercado",
    foco: "Produção de café orgânico",
    objetivo: "Busca apoio para expandir exportação"
  },
  "Capital Verde": {
    tempo: "10 anos de atuação",
    foco: "Investimentos em sustentabilidade",
    objetivo: "Procura produtores para projetos de energia limpa"
  }
};

function mostrarInfo(nome) {
  var dados = dadosParceiros[nome];
  if (dados) {
    // Atualiza conteúdo dos cards
    document.getElementById("card1").innerHTML =
      `<h3>Tempo de Mercado</h3><p>${dados.tempo}</p>`;
    document.getElementById("card2").innerHTML =
      `<h3>Foco Principal</h3><p>${dados.foco}</p>`;
    document.getElementById("card3").innerHTML =
      `<h3>Objetivo Atual</h3><p>${dados.objetivo}</p>`;

    // Move o localizador para a esquerda
    document.getElementById("localizador").classList.add("move-left");

    // Exibe os cards informativos
    var features = document.getElementById("cards-info");
    features.classList.add("show");

    // Dispara animação nos cards
    var cards = document.querySelectorAll(".features .feature-card");
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove("visible"); // reseta
      void cards[i].offsetWidth;            // força reflow
      cards[i].classList.add("visible");    // aplica animação
    }
  }
}



// =========================================================
//  Lógica de Validação do Formulário
// =========================================================

   document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contato-form");
    const nomeInput = form.querySelector("input[type='text']");
    const emailInput = form.querySelector("input[type='email']");
    const telefoneInput = form.querySelector("input[type='tel']");
    const mensagemInput = form.querySelector("textarea");
    const submitBtn = form.querySelector("button");

    // Função para criar/mostrar mensagens de erro
    function mostrarErro(input, mensagem) {
    let msg = input.nextElementSibling;
    if (!msg || (!msg.classList.contains("erro-msg") && !msg.classList.contains("sucesso-msg"))) {
        msg = document.createElement("small");
        input.insertAdjacentElement("afterend", msg);
    }
    msg.className = "erro-msg";
    msg.textContent = mensagem;
    }


    // Função para criar/mostrar mensagens de sucesso
    function mostrarSucesso(input, mensagem) {
    let msg = input.nextElementSibling;
    if (!msg || (!msg.classList.contains("erro-msg") && !msg.classList.contains("sucesso-msg"))) {
        msg = document.createElement("small");
        input.insertAdjacentElement("afterend", msg);
    }
    msg.className = "sucesso-msg";
    msg.textContent = mensagem;
    }


    // Validação do Nome
    function validarNome() {
        const valor = nomeInput.value.trim();
        if (valor === "") {
            mostrarErro(nomeInput, "*Campo Obrigatório.");
            return false;
        }
        const partes = valor.split(" ");
        if (partes.length < 2) {
            mostrarErro(nomeInput, "Digite nome e sobrenome.");
            return false;
        }
        if (partes.some(p => p.length < 2)) {
            mostrarErro(nomeInput, "Nome e Sobrenome devem ter pelo menos 2 letras.");
            return false;
        }
        mostrarSucesso(nomeInput, "Informação válida ✓")
        return true;
    }

    // Validação do Email
    function validarEmail() {
        const valor = emailInput.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (valor === "") {
            mostrarErro(emailInput, "*Campo Obrigatório.");
            return false;
        }
        if (!regex.test(valor)) {
            mostrarErro(emailInput, "Digite um email válido.");
            return false;
        }
        mostrarSucesso(emailInput, "Informação válida ✓")
        return true;
    }

    // Validação do Telefone
    function validarTelefone() {
    let valor = telefoneInput.value.replace(/\D/g, ""); // remove tudo que não for número

    // Limitar a 11 dígitos
    if (valor.length > 11) {
        valor = valor.slice(0, 11);
    }

    // Formatar como (XX) 9 XXXX-XXXX
    let formatado = valor;
    if (valor.length > 0) {
        if (valor.length <= 2) {
            formatado = `(${valor}`;
        } else if (valor.length <= 3) {
            formatado = `(${valor.slice(0,2)}) ${valor.slice(2)}`;
        } else if (valor.length <= 7) {
            formatado = `(${valor.slice(0,2)}) ${valor.slice(2,3)} ${valor.slice(3)}`;
        } else {
            formatado = `(${valor.slice(0,2)}) ${valor.slice(2,3)} ${valor.slice(3,7)}-${valor.slice(7)}`;
        }
    }

    telefoneInput.value = formatado;

    // Validação final
    const apenasNumeros = valor;

    if (valor === "") {
            mostrarErro(telefoneInput, "*Campo Obrigatório.");
            return false;
    }

    if (apenasNumeros.length !== 11) {
        mostrarErro(telefoneInput, "Digite um telefone válido com 11 dígitos (DDD + celular).");
        return false;
    }

    // Verificar se o primeiro dígito após o DDD é 9
    if (apenasNumeros[2] !== "9") {
        mostrarErro(telefoneInput, "O número de celular deve começar com 9 após o DDD.");
        return false;
    }

    mostrarSucesso(telefoneInput, "Informação válida ✓");
    return true;
    }

    // Evento para aplicar formatação em tempo real
    telefoneInput.addEventListener("input", () => {
        validarTelefone();
        atualizarBotao();
    });



    // Validação da Mensagem
    function validarMensagem() {
        const valor = mensagemInput.value.trim();
        if (valor === "") {
            mostrarErro(mensagemInput, "*Campo Obrigatório.");
            return false;
        }
        if (valor.length > 500) {
            mostrarErro(mensagemInput, "A mensagem deve ter no máximo 500 caracteres.");
            return false;
        }
        mostrarSucesso(mensagemInput, "Informação válida ✓");
        return true;
    }

    // Ativar/Desativar botão de envio
    function atualizarBotao() {
        if (validarNome() && validarEmail() && validarTelefone() && validarMensagem()) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    // Eventos de validação em tempo real
    nomeInput.addEventListener("input", () => { validarNome(); atualizarBotao(); });
    emailInput.addEventListener("input", () => { validarEmail(); atualizarBotao(); });
    telefoneInput.addEventListener("input", () => { validarTelefone(); atualizarBotao(); });
    mensagemInput.addEventListener("input", () => { validarMensagem(); atualizarBotao(); });

    // Validação final no envio
    form.addEventListener("submit", (e) => {
    e.preventDefault(); // impede envio real para teste

    if (validarNome() && validarEmail() && validarTelefone() && validarMensagem()) {
        const msgSucesso = form.querySelector(".mensagem-sucesso");
        msgSucesso.textContent = "Mensagem enviada com sucesso!";
        msgSucesso.style.display = "block";

        // Opcional: limpar os campos após envio
        form.reset();
        submitBtn.disabled = true; // volta a desabilitar até preencher novamente
    }
    });


    // Inicialmente desabilita o botão
    submitBtn.disabled = true;
    });


// =========================================================
// GUIA INTERATIVO COM CARDS E SETAS
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const tooltip = document.createElement("div");
  const arrow = document.createElement("div");

  tooltip.className = "guia-tooltip";
  arrow.className = "guia-seta";
  tooltip.setAttribute("role", "status");
  tooltip.setAttribute("aria-live", "polite");

  document.body.appendChild(tooltip);
  document.body.appendChild(arrow);

  const orientacoes = [
    {
      seletor: "nav a[href='#Home']",
      titulo: "Inicio do site",
      texto: "Clique aqui para voltar ao topo e rever a proposta principal da SeederLink."
    },
    {
      seletor: "nav a[href='#SobreNos']",
      titulo: "Sobre a SeederLink",
      texto: "Use este link para conhecer a historia, missao, visao e valores do projeto."
    },
    {
      seletor: "nav a[href='#ComoFunciona']",
      titulo: "Entenda o fluxo",
      texto: "Clique para ver, em etapas, como investidor, plataforma e produtor se conectam."
    },
    {
      seletor: "nav a[href='#Plataforma']",
      titulo: "Acesse a plataforma",
      texto: "Este atalho leva ao localizador de parceiros, onde voce escolhe um perfil e busca conexoes."
    },
    {
      seletor: "nav a[href='#Contato']",
      titulo: "Fale com a equipe",
      texto: "Clique para ir direto ao formulario. A pagina Fale Conosco valida nome completo, email, telefone e descricao da mensagem."
    },
    {
      seletor: ".btn-home",
      titulo: "Saiba como funciona",
      texto: "Clique neste botao para descer ate a explicacao do processo em tres etapas."
    },
    {
      seletor: ".btn-outline",
      titulo: "Entre em contato",
      texto: "Este botao leva ao formulario. Preencha nome completo, email valido, telefone e uma mensagem de ate 500 caracteres."
    },
    {
      seletor: ".pitch-link",
      titulo: "Pitch do projeto",
      texto: "Clique para abrir o video em uma nova aba e conhecer a apresentacao da SeederLink."
    },
    {
      seletor: ".home-card:nth-child(1)",
      titulo: "Credito rural inteligente",
      texto: "Este card resume a proposta de financiamento sustentavel apoiado por tecnologia."
    },
    {
      seletor: ".home-card:nth-child(2)",
      titulo: "Investimento de impacto",
      texto: "Aqui voce identifica o foco em retorno financeiro combinado com impacto social."
    },
    {
      seletor: ".home-card:nth-child(3)",
      titulo: "Transparencia total",
      texto: "Este ponto destaca a rastreabilidade para acompanhar a cadeia produtiva."
    },
    {
      seletor: ".home-card:nth-child(4)",
      titulo: "Conexao direta",
      texto: "Este card mostra que a plataforma aproxima investidores e produtores rurais."
    },
    {
      seletor: ".sobre-card:nth-child(1)",
      titulo: "Missao",
      texto: "Passe por este card para entender o compromisso com credito justo e reducao da fome."
    },
    {
      seletor: ".sobre-card:nth-child(2)",
      titulo: "Visao",
      texto: "Este card apresenta a ambicao de ser referencia em solucoes digitais sustentaveis."
    },
    {
      seletor: ".sobre-card:nth-child(3)",
      titulo: "Valores",
      texto: "Aqui ficam os principios que guiam a experiencia: transparencia, inclusao e sustentabilidade."
    },
    {
      seletor: ".timeline-card:nth-child(1)",
      titulo: "Etapa 1: investidor",
      texto: "Comece por este card para entender o papel de quem define investimentos e acompanha impacto."
    },
    {
      seletor: ".timeline-card:nth-child(2)",
      titulo: "Etapa 2: plataforma",
      texto: "Este card explica a funcao da inteligencia da plataforma ao combinar perfis."
    },
    {
      seletor: ".timeline-card:nth-child(3)",
      titulo: "Etapa 3: produtor rural",
      texto: "Aqui esta o resultado esperado: acesso a credito para ampliar a producao sustentavel."
    },
    {
      seletor: "#localizador",
      titulo: "Localizador de parceiros",
      texto: "Use esta area para escolher se deseja procurar produtor rural ou investidor. Esta e uma funcionalidade extra implementada fora do Fale Conosco."
    },
    {
      seletor: ".perfil-card:nth-child(1)",
      titulo: "Selecionar produtor",
      texto: "Clique neste card se voce quer encontrar produtores rurais disponiveis para parceria."
    },
    {
      seletor: ".perfil-card:nth-child(2)",
      titulo: "Selecionar investidor",
      texto: "Clique neste card se voce quer encontrar investidores de impacto disponiveis."
    },
    {
      seletor: "#estado",
      titulo: "Escolha o estado",
      texto: "Depois de escolher um perfil, selecione o estado para filtrar os parceiros encontrados."
    },
    {
      seletor: ".estado-busca button",
      titulo: "Buscar parceiros",
      texto: "Clique aqui depois de selecionar o estado para listar as opcoes compativeis."
    },
    {
      seletor: ".parceiro-opcao",
      titulo: "Escolha um parceiro",
      texto: "Clique em um resultado para ver tempo de mercado, foco principal e objetivo atual."
    },
    {
      seletor: "#seguir-processo-btn",
      titulo: "Seguir com o processo",
      texto: "Clique para ir ao contato e informar seus dados para continuar a conexao."
    },
    {
      seletor: "#cards-info .feature-card",
      titulo: "Informacoes do parceiro",
      texto: "Use estes cards para avaliar se o parceiro combina com seu objetivo antes de continuar."
    },
    {
      seletor: ".info-card:nth-child(1)",
      titulo: "Email de contato",
      texto: "Use este dado se preferir falar diretamente por email com a equipe SeederLink."
    },
    {
      seletor: ".info-card:nth-child(2)",
      titulo: "Telefone",
      texto: "Use este contato para uma conversa mais direta com a equipe."
    },
    {
      seletor: ".info-card:nth-child(3)",
      titulo: "Localizacao",
      texto: "Este card informa a base de atuacao apresentada pelo projeto."
    },
    {
      seletor: ".contato-form input[type='text']",
      titulo: "Nome completo",
      texto: "Campo obrigatorio. Digite nome e sobrenome; cada parte precisa ter ao menos duas letras."
    },
    {
      seletor: ".contato-form input[type='email']",
      titulo: "Email valido",
      texto: "Campo obrigatorio. Informe um email em formato valido para receber o retorno da equipe."
    },
    {
      seletor: ".contato-form input[type='tel']",
      titulo: "Telefone com DDD",
      texto: "Digite seu celular com DDD. O campo formata o numero automaticamente enquanto voce escreve."
    },
    {
      seletor: ".contato-form textarea",
      titulo: "Mensagem",
      texto: "Campo obrigatorio. Descreva seu objetivo, perfil ou interesse em no maximo 500 caracteres."
    },
    {
      seletor: ".contato-form button",
      titulo: "Enviar formulario",
      texto: "O envio so fica disponivel quando nome completo, email, telefone e mensagem passam nas validacoes visuais do projeto."
    }
  ];

  function obterOrientacao(elemento) {
    for (let i = 0; i < orientacoes.length; i++) {
      if (elemento.matches(orientacoes[i].seletor)) {
        return orientacoes[i];
      }
    }

    return null;
  }

  function posicionar(elemento) {
    const margem = 16;
    const espacoSetaVertical = 100;
    const setaLargura = 92;
    const setaAltura = 48;
    const setaRotacionadaAltura = 92;
    const rect = elemento.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const largura = tooltipRect.width || 320;
    const altura = tooltipRect.height || 120;

    let left = rect.left + (rect.width / 2) - (largura / 2);
    left = Math.max(margem, Math.min(left, window.innerWidth - largura - margem));

    let top = rect.top - altura - espacoSetaVertical;
    let setaTop = rect.top - 112;
    let setaClasse = "baixo";

    if (top < margem) {
      top = rect.bottom + 100;
      setaTop = rect.bottom + 26;
      setaClasse = "cima";
    }

    if (top + altura > window.innerHeight - margem) {
      top = Math.max(margem, rect.top + (rect.height / 2) - (altura / 2));
      left = rect.right + 94;
      setaClasse = "esquerda";

      if (left + largura > window.innerWidth - margem) {
        left = rect.left - largura - 94;
        setaClasse = "direita";
      }
    }

    const tooltipLeft = Math.max(margem, Math.min(left, window.innerWidth - largura - margem));
    const tooltipTop = Math.max(margem, Math.min(top, window.innerHeight - altura - margem));

    tooltip.style.left = `${tooltipLeft}px`;
    tooltip.style.top = `${tooltipTop}px`;

    let setaLeft = rect.left + (rect.width / 2) - (setaLargura / 2);

    if (setaClasse === "baixo") {
      setaLeft = Math.max(tooltipLeft + 16, Math.min(setaLeft, tooltipLeft + largura - setaLargura - 16));
      setaTop = tooltipTop + altura + ((setaRotacionadaAltura - setaAltura) / 2);
    } else if (setaClasse === "cima") {
      setaLeft = Math.max(tooltipLeft + 16, Math.min(setaLeft, tooltipLeft + largura - setaLargura - 16));
      setaTop = tooltipTop - setaRotacionadaAltura + ((setaRotacionadaAltura - setaAltura) / 2);
    } else if (setaClasse === "esquerda") {
      setaLeft = tooltipLeft - setaLargura;
      setaTop = Math.max(tooltipTop + 12, Math.min(rect.top + (rect.height / 2) - (setaAltura / 2), tooltipTop + altura - setaAltura - 12));
    } else if (setaClasse === "direita") {
      setaLeft = tooltipLeft + largura;
      setaTop = Math.max(tooltipTop + 12, Math.min(rect.top + (rect.height / 2) - (setaAltura / 2), tooltipTop + altura - setaAltura - 12));
    }

    arrow.className = `guia-seta ${setaClasse} ativo`;
    arrow.style.left = `${Math.max(8, Math.min(setaLeft, window.innerWidth - 100))}px`;
    arrow.style.top = `${Math.max(8, Math.min(setaTop, window.innerHeight - 58))}px`;
  }

  function mostrarGuia(evento) {
    const orientacao = obterOrientacao(evento.currentTarget);

    if (!orientacao) {
      return;
    }

    tooltip.innerHTML = `<h4>${orientacao.titulo}</h4><p>${orientacao.texto}</p>`;
    tooltip.classList.add("ativo");
    posicionar(evento.currentTarget);
  }

  function esconderGuia() {
    tooltip.classList.remove("ativo");
    arrow.className = "guia-seta";
  }

  function ativarGuias() {
    orientacoes.forEach((orientacao) => {
      const elementos = document.querySelectorAll(orientacao.seletor);

      elementos.forEach((elemento) => {
        if (elemento.dataset.guiaAtivo === "true") {
          return;
        }

        elemento.dataset.guiaAtivo = "true";
        elemento.addEventListener("mouseenter", mostrarGuia);
        elemento.addEventListener("mouseleave", esconderGuia);
        elemento.addEventListener("focus", mostrarGuia);
        elemento.addEventListener("blur", esconderGuia);
      });
    });
  }

  ativarGuias();
  window.addEventListener("resize", esconderGuia);
  window.addEventListener("scroll", esconderGuia, { passive: true });

  const observadorGuia = new MutationObserver(ativarGuias);
  observadorGuia.observe(document.body, {
    childList: true,
    subtree: true
  });
});
