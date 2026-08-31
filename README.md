# SeederLink 🌱

SeederLink é um site institucional e interativo voltado para conectar produtores rurais e investidores de impacto. A proposta da plataforma é apresentar uma solução de crédito rural inteligente, sustentável e transparente, com foco em ESG, inclusão financeira e aproximação entre o campo e o capital.

O projeto foi migrado para o framework **React** (utilizando Vite), preservando 100% de sua identidade visual, responsividade, regras de negócio, validações de formulário, animações de scroll e guias interativos com tooltips e setas direcionais.

---

## 🚀 Como executar o projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado no sistema.

### Instalação das dependências
```bash
npm install
```

### Execução em ambiente de desenvolvimento
```bash
npm run dev
```
O servidor de desenvolvimento estará disponível em: `http://localhost:3000/`

### Build para produção
```bash
npm run build
```
Os arquivos otimizados e prontos para publicação serão gerados na pasta `dist/`.

### Pré-visualização da build de produção
```bash
npm run preview
```

---

## Estrutura do projeto React 📁

```
├── public/
│   └── img/                         # Imagens e ícones estáticos do projeto
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Cabeçalho fixo com efeito scroll e links suaves
│   │   ├── Hero.jsx                 # Seção Home (chamada, botões, pitch YouTube, cards)
│   │   ├── SobreNos.jsx             # Seção Sobre Nós (história, cards Missão, Visão, Valores)
│   │   ├── ComoFunciona.jsx         # Seção Como Funciona (timeline de 3 etapas)
│   │   ├── Plataforma.jsx           # Localizador de parceiros, filtros e cards de informação
│   │   ├── Contato.jsx              # Informações de contato e formulário com validações e máscara
│   │   ├── Footer.jsx               # Rodapé institucional
│   │   ├── PopupContato.jsx         # Modal de encaminhamento para o contato
│   │   └── GuiaInterativo.jsx       # Componente do guia visual com setas e tooltips flutuantes
│   ├── data/
│   │   ├── parceiros.js             # Base de dados simulada de parceiros e informações
│   │   └── guiaOrientacoes.js       # Lista de orientações e seletores do guia interativo
│   ├── hooks/
│   │   └── useScrollAnimation.js    # Hook reutilizável de IntersectionObserver
│   ├── index.css                    # Estilos CSS completos preservados fielmente
│   ├── App.jsx                      # Componente raiz unindo todas as seções
│   └── main.jsx                     # Ponto de entrada do React
├── index.html                       # Template HTML raiz com fontes e metadados
├── vite.config.js                   # Configuração do Vite
└── package.json                     # Dependências do projeto (React, Vite)
```

---

## Plataforma Inteligente 🚜

A seção “Plataforma Inteligente” representa a principal funcionalidade interativa do projeto. Ela simula um localizador de parceiros, permitindo que o usuário escolha entre dois perfis: Produtor Rural ou Investidor.

A regra de negócio implementada é a seguinte:

1. O usuário escolhe se deseja procurar um produtor rural ou um investidor.
2. Ao selecionar o perfil, o estado `perfilSelecionado` é atualizado e o seletor de estado é exibido.
3. O usuário seleciona São Paulo (`SP`) ou Minas Gerais (`MG`).
4. Ao clicar em “Buscar”, a lista simulada de parceiros compatíveis é exibida como opções clicáveis.
5. Ao clicar em um parceiro, os cards informativos de tempo de mercado, foco principal e objetivo atual são exibidos com animação.
6. É exibido o botão “Seguir com o processo”.
7. Ao clicar no botão, abre-se o modal estilizado informando que o usuário deve preencher seus dados na seção Fale Conosco. Ao fechar ou confirmar, a página rola suavemente até `#Contato`.

---

## Fale Conosco 📬

A seção “Fale Conosco” permite o envio de contato com validações em tempo real implementadas de forma reativa:

### Nome completo 👤
- Obrigatório.
- Deve conter nome e sobrenome.
- Tanto o nome quanto o sobrenome precisam ter pelo menos duas letras.

### E-mail ✉️
- Obrigatório.
- Deve atender ao formato válido de e-mail via regex (`usuario@dominio.com`).

### Telefone 📱
- Obrigatório.
- Máscara automática em tempo real no padrão `(XX) 9 XXXX-XXXX`.
- Deve conter exatamente 11 dígitos numéricos com o dígito `9` após o DDD.

### Descrição da mensagem 📝
- Obrigatória.
- Máximo de 500 caracteres.

### Botão de envio 🔘
- Habilitado dinamicamente somente quando todos os 4 campos passarem nas validações visuais.
- Ao enviar, apresenta a mensagem "Mensagem enviada com sucesso!" e reseta os campos.

---

## Guia interativo e popup 💡

O site possui uma camada de assistência visual reativa (`GuiaInterativo.jsx`). Ao passar o mouse ou focar sobre botões, cards e campos em qualquer seção, aparecem cards flutuantes com explicações de navegação e setas pulsantes apontando na direção adequada.
