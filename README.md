# SeederLink 🌱

SeederLink é um site institucional e interativo voltado para conectar produtores rurais e investidores de impacto. A proposta da plataforma é apresentar uma solução de crédito rural inteligente, sustentável e transparente, com foco em ESG, inclusão financeira e aproximação entre o campo e o capital.

O projeto foi desenvolvido como uma aplicação front-end estática, usando HTML, CSS e JavaScript. Atualmente, os dados exibidos na plataforma são simulados no próprio código, sem banco de dados ou servidor real.

## Estrutura do projeto 📁

- `index.html`: armazena a estrutura principal da página, incluindo Home, Sobre Nós, Como Funciona, Plataforma Inteligente, Fale Conosco e Footer.
- `css/styles.css`: concentra a identidade visual, responsividade, animações, cards, formulário, popup, guia interativo e estilos da plataforma.
- `js/script.js`: guarda as regras de interação, animações ao scroll, busca simulada de parceiros, seleção de perfil, exibição de informações, popup de orientação e validação do formulário.
- `img/`: contém imagens e ícones utilizados nas seções do site.

## Plataforma Inteligente 🚜

A seção “Plataforma Inteligente” representa a principal funcionalidade interativa do projeto. Ela simula um localizador de parceiros, permitindo que o usuário escolha entre dois perfis: Produtor Rural ou Investidor.

No front-end, essa área está em `index.html`, dentro da seção `#Plataforma`. A estrutura possui um card principal chamado `#localizador`, dois cards de perfil com a classe `.perfil-card`, um seletor de estado `#estado`, um botão de busca e uma área de resultado `#resultado`.

A regra de negócio implementada é a seguinte:

1. O usuário escolhe se deseja procurar um produtor rural ou um investidor.
2. Ao selecionar o perfil, o JavaScript salva essa escolha na variável `perfilSelecionado`.
3. O campo de estado, que inicialmente fica oculto, passa a ser exibido.
4. O usuário seleciona São Paulo ou Minas Gerais.
5. Ao clicar em “Buscar”, a função `buscarParceiros()` filtra uma lista simulada de parceiros.
6. Se houver parceiros compatíveis com o estado e o perfil selecionado, eles aparecem como opções clicáveis.
7. Ao clicar em um parceiro, a função `selecionarParceiro()` destaca a opção escolhida e chama `mostrarInfo(nome)`.
8. A função `mostrarInfo(nome)` exibe três cards informativos com tempo de mercado, foco principal e objetivo atual do parceiro.
9. Depois da escolha, aparece o botão “Seguir com o processo”.
10. Ao clicar nesse botão, um popup estilizado informa que o usuário deve preencher seus dados na seção Fale Conosco.

Os dados usados nessa simulação ficam no próprio `js/script.js`. A lista simples de parceiros aparece dentro da função `buscarParceiros()`, enquanto os detalhes de cada parceiro ficam no objeto `dadosParceiros`.

Essa funcionalidade ainda não busca dados reais em uma base externa. Ela foi criada para demonstrar, no front-end, como seria o fluxo de conexão entre produtores e investidores dentro da SeederLink.

## Fale Conosco 📬

A seção “Fale Conosco” permite que o usuário envie seus dados para participar da transformação sustentável proposta pelo projeto. Ela funciona como o ponto final do fluxo: depois de conhecer a plataforma ou escolher um parceiro, o usuário é orientado a preencher o formulário.

No `index.html`, essa área fica na seção `#Contato`. Ela contém cards de informação com e-mail, telefone e localização, além do formulário `.contato-form`.

O formulário possui os seguintes campos:

- Nome e sobrenome.
- E-mail.
- Telefone.
- Descrição da mensagem.
- Botão de envio.

As regras de validação ficam em `js/script.js`, dentro da lógica de validação do formulário. O botão de envio começa desabilitado e só é liberado quando todos os campos obrigatórios são preenchidos corretamente.

### Nome completo 👤

Regra de negócio:

- Não pode ficar em branco.
- Não aceita somente um nome.
- Deve conter nome e sobrenome.
- Tanto o nome quanto o sobrenome precisam ter pelo menos duas letras.

No código, essa regra é aplicada pela função `validarNome()`. Quando o valor está incorreto, o site mostra uma mensagem de erro abaixo do campo. Quando está correto, mostra uma mensagem de sucesso.

### E-mail ✉️

Regra de negócio:

- Não pode ficar em branco.
- Deve estar em um formato válido de e-mail.

A função `validarEmail()` usa uma expressão regular simples para verificar se o valor informado segue o formato esperado, como `usuario@dominio.com`.

### Telefone 📱

O telefone foi acrescentado como campo extra. Ele reforça a possibilidade de contato direto com o usuário.

Regra de negócio:

- Não pode ficar em branco.
- Deve conter 11 dígitos.
- Deve incluir DDD.
- O primeiro dígito depois do DDD deve ser 9, simulando um celular brasileiro.
- O campo é formatado automaticamente no padrão `(DD) 9 XXXX-XXXX`.

Essa regra está na função `validarTelefone()`.

### Descrição da mensagem 📝

Regra de negócio:

- Não pode ficar em branco.
- Deve ter no máximo 500 caracteres.

A função `validarMensagem()` garante que o usuário escreva uma mensagem e que ela não ultrapasse o limite definido.

## Guia interativo e popup 💡

O site também possui uma camada de ajuda visual. Ao passar o mouse sobre botões, cards e campos, aparecem cards flutuantes com explicações de navegação, além de setas pulsantes indicando onde o usuário deve clicar ou prestar atenção.

Essa funcionalidade está no final de `js/script.js`, na seção “GUIA INTERATIVO COM CARDS E SETAS”, e seus estilos estão em `css/styles.css`, na seção “GUIA INTERATIVO”.

O alerta nativo do navegador foi substituído por um popup personalizado. Esse popup aparece quando o usuário clica em “Seguir com o processo” e informa:

“Para seguir com o processo, precisamos que você informe seus dados na seção de Contato.”

O popup usa as cores da identidade visual do site e inclui um emoji de plantinha para reforçar o tema sustentável.

## Identidade visual 🎨

Todas as seções seguem uma identidade visual baseada em tons de verde, fundos suaves, cards arredondados, sombras leves, animações de entrada e botões com destaque. O objetivo é transmitir tecnologia, sustentabilidade, confiança e conexão com o agronegócio.

Os principais estilos estão em `css/styles.css`, incluindo:

- Navbar fixa.
- Seções responsivas.
- Cards da Home, Sobre Nós, Como Funciona e Plataforma.
- Formulário de contato.
- Mensagens de erro e sucesso.
- Popup central.
- Guias de navegação com cards e setas.

## Futuras atualizações 🔮

Em versões futuras, o projeto poderá receber um back-end real. Isso permitiria transformar a simulação atual em uma plataforma funcional com armazenamento e busca de dados reais.

Possíveis evoluções:

- Armazenar os dados enviados no formulário Fale Conosco em um banco de dados.
- Criar uma API para cadastrar produtores rurais e investidores.
- Buscar parceiros reais com filtros por estado, perfil, área de atuação e objetivo.
- Permitir login de usuários.
- Criar painéis separados para produtores, investidores e administradores.
- Registrar histórico de contatos e interesses.
- Conectar o formulário a serviços de e-mail ou CRM.
- Substituir a lista simulada em JavaScript por consultas reais ao banco de dados.

Com essas atualizações, a SeederLink deixaria de ser apenas uma demonstração front-end e passaria a funcionar como uma aplicação completa para conexão entre produtores rurais e investidores de impacto.
