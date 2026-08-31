# SeederLink 🌱

SeederLink é uma plataforma institucional e interativa criada para aproximar investidores de impacto e produtores rurais. A solução propõe um modelo de crédito rural sustentável, transparente e inteligente, alinhado aos princípios ESG, inclusão financeira e fortalecimento do agronegócio responsável.

Este documento apresenta o histórico do projeto, detalhando **como ele era originalmente (HTML/CSS/JavaScript puro)** e **como ficou estruturado após a migração completa para o framework React com Vite**, comparando detalhadamente cada aspecto técnico e arquitetural.

---

## 🏛️ Como o Projeto Era Originalmente (Antes da Migração)

Inicialmente, o projeto foi concebido como uma aplicação front-end estática clássica (Vanilla Web), dividida em três arquivos principais:

```
├── index.html       # Arquivo único com todo o HTML da página (~560 linhas)
├── css/
│   └── styles.css   # Folha de estilo global com todas as seções e animações
├── js/
│   └── script.js    # Script com toda a lógica imperativa do site (~740 linhas)
└── img/             # Imagens e ícones estáticos
```

### Características do código original:
1. **Manipulação Direta e Imperativa do DOM**:
   - Criação manual de elementos com `document.createElement()`, inserções via `appendChild()`, `insertAdjacentElement()` e interpolações com `innerHTML`.
   - Modificação direta de classes CSS usando `classList.add()` e `classList.remove()`.
2. **Estado Global Não Centralizado**:
   - Variáveis globais (`perfilSelecionado`, `dadosParceiros`) espalhadas pelo escopo do script.
   - Visibilidade de elementos controlada via `style.display = 'none'` e `style.display = 'block'` diretamente pelo JavaScript.
3. **Validação de Formulário Imperativa**:
   - Elementos `<small>` de mensagens de erro/sucesso eram criados e inseridos no DOM sob demanda durante o evento de input.
4. **Popup Criado Dinamicamente no Body**:
   - Toda vez que o usuário clicava em "Seguir com o processo", o JavaScript criava um novo nó no `document.body` e destruía o nó anterior.
5. **Sem Pipeline de Build**:
   - Os arquivos eram servidos diretamente sem minificação, otimização de módulos ou Hot Module Replacement (HMR).

---

## ⚛️ A Transformação com a Implantação do React

O projeto foi totalmente migrado para o ecossistema **React 18 + Vite**, mantendo **100% de fidelidade visual, de comportamentos e de estilos**, mas modernizando a base de código para um modelo **declarativo, componentizado e modular**.

### 📊 Comparativo Detalhado: Antes (Vanilla) vs. Depois (React)

| Aspecto / Recurso | Como Era Antes (Vanilla JS / HTML) | Como Ficou Agora (React + Vite) |
| :--- | :--- | :--- |
| **Arquitetura** | Monolítica em um único arquivo HTML de 560 linhas e JS de 740 linhas. | Componentizada e modular em `src/components/`, separando responsabilidades. |
| **Renderização** | Imperativa (manipulação direta de nós no DOM com `innerHTML` e `appendChild`). | Declarativa e Reativa (JSX sincronizado automaticamente com estados `useState`). |
| **Gerenciamento de Estado** | Variáveis globais soltas (`var perfilSelecionado = ""`). | Estados encapsulados com `useState` nos componentes responsáveis. |
| **Navbar & Scroll** | `window.addEventListener('scroll')` adicionando/removendo classes no nó `nav`. | Componente [`Navbar.jsx`](file:///c:/Users/dansf/OneDrive/%C3%81rea%20de%20Trabalho/site_seederlink-wolvestech/src/components/Navbar.jsx) com estado reativo `isScrolled` via `useEffect`. |
| **Localizador de Parceiros** | Interpolação de HTML via strings em `resultado.innerHTML += ...` e busca imperativa. | Componente [`Plataforma.jsx`](file:///c:/Users/dansf/OneDrive/%C3%81rea%20de%20Trabalho/site_seederlink-wolvestech/src/components/Plataforma.jsx) com filtragem reativa e renderização via `.map()`. |
| **Cards de Detalhes** | Alteração manual de `innerHTML` nos cards `card1`, `card2` e `card3`. | Renderização limpa baseada no objeto de dados selecionado (`infoParceiro`). |
| **Popup / Modal de Contato** | Função `mostrarPopupContato()` criava e destruía nós HTML no `document.body`. | Componente declarativo [`PopupContato.jsx`](file:///c:/Users/dansf/OneDrive/%C3%81rea%20de%20Trabalho/site_seederlink-wolvestech/src/components/PopupContato.jsx) controlado pela prop `isOpen`. |
| **Formulário Fale Conosco** | Múltiplos listeners manuais criando e injetando tags `<small class="erro-msg">`. | Componente [`Contato.jsx`](file:///c:/Users/dansf/OneDrive/%C3%81rea%20de%20Trabalho/site_seederlink-wolvestech/src/components/Contato.jsx) controlado via `formData`, validação reativa e máscara de telefone. |
| **Guia Interativo (Tooltips/Setas)** | Script acoplado manipulando elementos flutuantes no DOM global. | Componente isolado [`GuiaInterativo.jsx`](file:///c:/Users/dansf/OneDrive/%C3%81rea%20de%20Trabalho/site_seederlink-wolvestech/src/components/GuiaInterativo.jsx) consumindo [`guiaOrientacoes.js`](file:///c:/Users/dansf/OneDrive/%C3%81rea%20de%20Trabalho/site_seederlink-wolvestech/src/data/guiaOrientacoes.js). |
| **Animações de Scroll** | `IntersectionObserver` inicializado no evento `DOMContentLoaded`. | Custom Hook reutilizável [`useScrollAnimation.js`](file:///c:/Users/dansf/OneDrive/%C3%81rea%20de%20Trabalho/site_seederlink-wolvestech/src/hooks/useScrollAnimation.js) acionado no ciclo de vida do React. |
| **Dados do Sistema** | Arrays e objetos declarados soltos dentro do script funcional. | Dados desacoplados e organizados na pasta `src/data/` ([`parceiros.js`](file:///c:/Users/dansf/OneDrive/%C3%81rea%20de%20Trabalho/site_seederlink-wolvestech/src/data/parceiros.js)). |
| **Ambiente e Build** | Execução direta sem empacotador. | **Vite**: servidor de desenvolvimento ultrarrápido com Hot Module Replacement e build otimizado. |

---

## 📁 Estrutura de Arquivos Atual (React)

```
├── public/
│   └── img/                         # Imagens e ícones estáticos acessíveis publicamente
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Cabeçalho fixo com efeito scroll e links suaves
│   │   ├── Hero.jsx                 # Seção Home (chamada, botões, pitch YouTube, cards)
│   │   ├── SobreNos.jsx             # Seção Sobre Nós (história, cards Missão, Visão, Valores)
│   │   ├── ComoFunciona.jsx         # Seção Como Funciona (timeline de 3 etapas)
│   │   ├── Plataforma.jsx           # Localizador de parceiros e cards informativos interativos
│   │   ├── Contato.jsx              # Informações e formulário com validações e máscara
│   │   ├── Footer.jsx               # Rodapé institucional
│   │   ├── PopupContato.jsx         # Modal de encaminhamento para o contato
│   │   └── GuiaInterativo.jsx       # Guia visual interativo com setas e tooltips flutuantes
│   ├── data/
│   │   ├── parceiros.js             # Base de dados simulada de produtores e investidores
│   │   └── guiaOrientacoes.js       # Lista de orientações e seletores do guia de navegação
│   ├── hooks/
│   │   └── useScrollAnimation.js    # Hook de IntersectionObserver para animações de entrada
│   ├── index.css                    # Folha de estilo global mantida integralmente
│   ├── App.jsx                      # Componente raiz unindo todas as seções e modais
│   └── main.jsx                     # Ponto de entrada que monta o React na div #root
├── index.html                       # Template HTML raiz com fontes Google e metadados
├── vite.config.js                   # Configuração do Vite com suporte a React
└── package.json                     # Manifesto com dependências (React 18, Vite, Bootstrap Icons)
```

---

## 🚜 Funcionalidades Mantidas e Aprimoradas

### 1. Plataforma Inteligente (Localizador de Parceiros)
- Permite alternar entre **Produtor Rural** e **Investidor** com feedback visual imediato.
- Seleção de estado (**SP** / **MG**) filtrando em tempo real a lista de parceiros cadastrados.
- Exibição de cards informativos com animação contendo:
  - *Tempo de Mercado*
  - *Foco Principal*
  - *Objetivo Atual*
- Botão "Seguir com o processo" que aciona o modal de confirmação.

### 2. Modal Popup Personalizado
- Design com identidade visual do projeto, ícone 🌱 e foco automático acessível.
- Ao clicar em "Ok" ou no botão de fechar (×), fecha o modal e rola suavemente a tela até a seção **Fale Conosco**.

### 3. Formulário de Contato com Validações em Tempo Real
- **Nome e Sobrenome**: Exige nome completo com ao menos 2 caracteres em cada parte.
- **E-mail**: Validação de padrão via expressão regular.
- **Telefone**: Aplicação de máscara em tempo real no formato `(XX) 9 XXXX-XXXX` e validação de 11 dígitos com prefixo 9.
- **Mensagem**: Validação de preenchimento até 500 caracteres.
- **Botão de Envio**: Habilitado somente quando todos os 4 campos forem válidos.
- **Feedback de Sucesso**: Exibe mensagem de confirmação e limpa os campos após o envio.

### 4. Guia Interativo com Setas e Tooltips
- Detecta dinamicamente a posição de cada botão, link, card ou input na tela.
- Posiciona o tooltip explicativo e uma seta amarela pulsante apontando na direção exata do elemento.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Ter o [Node.js](https://nodejs.org/) instalado no computador.

### 1. Instalar as dependências
```bash
npm install
```

### 2. Executar em modo de desenvolvimento
```bash
npm run dev
```
Abra o navegador em: [http://localhost:3000/](http://localhost:3000/)

### 3. Gerar a build otimizada de produção
```bash
npm run build
```
Os arquivos finais minificados serão gerados no diretório `dist/`.

### 4. Visualizar a build de produção localmente
```bash
npm run preview
```
