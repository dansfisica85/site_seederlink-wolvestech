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
│   │   ├── MapaClimatico.jsx         # Mapa, marcador, métricas e resposta da pré-análise
│   │   ├── Footer.jsx               # Rodapé institucional
│   │   ├── PopupContato.jsx         # Modal de encaminhamento para o contato
│   │   └── GuiaInterativo.jsx       # Guia visual interativo com setas e tooltips flutuantes
│   ├── data/
│   │   ├── parceiros.js             # Base de dados simulada de produtores e investidores
│   │   └── guiaOrientacoes.js       # Lista de orientações e seletores do guia de navegação
│   ├── hooks/
│   │   └── useScrollAnimation.js    # Hook de IntersectionObserver para animações de entrada
│   ├── lib/
│   │   └── climate.js               # API climática, médias, validações e regra de triagem
│   ├── index.css                    # Folha de estilo global mantida integralmente
│   ├── App.jsx                      # Componente raiz unindo todas as seções e modais
│   └── main.jsx                     # Ponto de entrada que monta o React na div #root
├── tests/
│   └── climate.test.js              # Testes automatizados dos cálculos e mensagens
├── index.html                       # Template HTML raiz com fontes Google e metadados
├── vite.config.js                   # Configuração do Vite com suporte a React
└── package.json                     # React 18, Vite, Leaflet e Bootstrap Icons
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

### 5. Localização e Triagem Climática — Nova Funcionalidade da Fase 5

O antigo card estático **Localização** da seção **Fale Conosco** passou a ser um componente React interativo. O usuário pode clicar no mapa, arrastar o marcador ou autorizar a localização do navegador. Cada nova coordenada cancela a consulta anterior e inicia uma análise do ponto selecionado.

O card mostra dois grupos de informações:

- **Condições atuais**: temperatura do ar, umidade relativa do ar e radiação solar;
- **Média anual recente**: médias das mesmas variáveis ao longo dos últimos 365 dias disponíveis. Ela é uma visão resumida para demonstração e não representa, isoladamente, o ciclo de uma cultura.

#### Fluxo da funcionalidade

1. O usuário seleciona uma coordenada no mapa do OpenStreetMap.
2. O React atualiza o estado e posiciona um marcador Leaflet arrastável. A instância imperativa do mapa é criada e desmontada de forma segura dentro de um `useEffect`.
3. Após 450 ms sem uma nova mudança de coordenada, a aplicação consulta simultaneamente a condição atual e o histórico da Open-Meteo. Esse intervalo evita chamadas repetidas durante ajustes rápidos do marcador.
4. Valores incompletos são descartados e são exigidos pelo menos 350 dias válidos.
5. Se o histórico primário falhar ou exceder cinco segundos, a aplicação tenta a API diária da NASA POWER. A contingência mantém os indicadores visíveis, mas, por segurança, nunca emite pré-aprovação automática, pois modelos diferentes podem produzir médias diferentes.
6. As médias históricas são comparadas com referências acadêmicas indicativas para soja e tomate.
7. O componente renderiza os indicadores, o resultado de cada critério e a mensagem correspondente.
8. Falha dos dois provedores ou histórico insuficiente gera um estado de erro próprio, sem ser tratado como reprovação de crédito.

#### Dados e unidades

| Informação | Campo da Open-Meteo | Unidade exibida |
| :--- | :--- | :--- |
| Temperatura atual | `temperature_2m` | °C |
| Umidade relativa atual | `relative_humidity_2m` | % |
| Radiação solar atual | `shortwave_radiation` | W/m² |
| Temperatura média histórica | `temperature_2m_mean` | °C |
| Umidade média histórica | `relative_humidity_2m_mean` | % |
| Radiação solar diária histórica | `shortwave_radiation_sum` | MJ/m²/dia |

A consulta histórica termina sete dias antes da data atual para evitar dados de reanálise ainda não consolidados. O modelo `era5_seamless` combina informações de superfície e radiação. Para este projeto acadêmico não é necessário armazenar chave ou token no código.

#### Regra demonstrativa da pré-análise

Para a mensagem positiva, os três critérios precisam ser atendidos ao mesmo tempo:

| Critério histórico | Faixa da triagem |
| :--- | :--- |
| Temperatura média | 20 °C a 27 °C |
| Umidade relativa média | 60% a 80% |
| Radiação solar média | mínimo de 8,5 MJ/m²/dia |

As faixas formam uma referência acadêmica indicativa. A temperatura considera a faixa de melhor adaptação da soja informada pela Embrapa e a interseção com condições adequadas ao tomate. O mínimo de radiação segue referência técnica para culturas termófilas que inclui o tomate. A umidade de 60% a 80% é usada como faixa de triagem, não como declaração universal de aptidão da soja.

Fontes técnicas:

- [Open-Meteo — Historical Weather API](https://open-meteo.com/en/docs/historical-weather-api)
- [Open-Meteo — Forecast API](https://open-meteo.com/en/docs)
- [NASA POWER — API diária por ponto](https://power.larc.nasa.gov/docs/services/api/temporal/daily/)
- [Leaflet — documentação de mapas, eventos e marcadores](https://leafletjs.com/reference.html)
- [OpenStreetMap — política de uso dos tiles](https://operations.osmfoundation.org/policies/tiles/)
- [Embrapa Soja — exigências de temperatura](https://bioinfo.cnpso.embrapa.br/seca/index.php?Itemid=435&catid=84&id=73%3Aexigencias-climaticas&option=com_content&view=article)
- [Embrapa Hortaliças — clima e radiação no tomateiro](https://www.embrapa.br/en/web/agencia-de-informacao-tecnologica/cultivos/tomate/pre-producao/caracteristicas/clima)
- [FAO — práticas agrícolas para hortaliças em ambiente protegido](https://www.fao.org/4/i3284e/i3284e.pdf)
- [Embrapa — produção de tomate em ambiente protegido](https://ainfo.cnptia.embrapa.br/digital/bitstream/item/80343/1/BritoJr-prod-tomate.pdf)
- [MAPA — Zoneamento Agrícola de Risco Climático](https://www.gov.br/agricultura/pt-br/assuntos/riscos-seguro/programa-nacional-de-zoneamento-agricola-de-risco-climatico)

> **Limitação importante:** esta é uma triagem climática demonstrativa. Os dados são modelados para uma célula geográfica e não equivalem a um sensor na propriedade. O resultado não substitui ZARC, análise de solo, disponibilidade hídrica, cultivar, época de plantio, vistoria agronômica ou análise financeira completa.

#### Limites dos serviços gratuitos

O arranjo atual é apropriado para a entrega da FIAP e para demonstração em portfólio. A API pública da Open-Meteo é gratuita e sem chave para uso não comercial, mas tem limite de chamadas e não oferece garantia de disponibilidade. Uma operação comercial deve contratar o plano/licença apropriado ou hospedar uma instância compatível. Da mesma forma, os tiles comunitários do OpenStreetMap operam em melhor esforço, sem SLA; uso comercial ou em escala deve adotar um provedor de mapas com capacidade e termos adequados.

- [Open-Meteo — planos, licença comercial e limites](https://open-meteo.com/en/pricing)
- [OpenStreetMap — política de disponibilidade dos tiles](https://operations.osmfoundation.org/policies/tiles/)

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

### 3. Executar os testes automatizados

```bash
npm test
```

Os testes validam período histórico, descarte de valores ausentes, quantidade mínima de dias, limites climáticos, coordenadas, URLs e o texto exato das duas mensagens.

### 4. Gerar a build otimizada de produção
```bash
npm run build
```
Os arquivos finais minificados serão gerados no diretório `dist/`.

### 5. Visualizar a build de produção localmente
```bash
npm run preview
```

### 6. Publicação automática no GitHub Pages

O repositório inclui o workflow `.github/workflows/deploy-pages.yml`. Em cada pull request ele instala as dependências, executa os testes e gera a build. Depois que uma alteração chega à branch `main`, o mesmo workflow publica a pasta `dist/` no GitHub Pages.

Passo a passo:

1. No GitHub, abra **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Envie ou mescle as alterações na branch `main`.
4. Acompanhe o workflow **Test and deploy GitHub Pages** na aba **Actions**.
5. Após o job `deploy` ficar verde, abra `https://dansfisica85.github.io/site_seederlink-wolvestech/` em uma janela anônima e valide mapa, dados e mensagens.

Durante a build publicada, `VITE_BASE_PATH` recebe `/site_seederlink-wolvestech/`, conforme exigido pelo Vite para um site hospedado em uma subpasta do GitHub Pages.

### 7. Alternativa: publicar na Vercel

O projeto é uma aplicação Vite sem variáveis secretas obrigatórias. Na importação pela Vercel, utilize:

- **Framework Preset:** Vite;
- **Build Command:** `npm run build`;
- **Output Directory:** `dist`;
- **Install Command:** `npm install`.

Após conectar o repositório, cada push na branch gera uma URL de preview. A produção deve ser promovida somente depois dos testes e da verificação visual da funcionalidade.
