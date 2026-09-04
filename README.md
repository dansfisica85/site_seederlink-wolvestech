# SeederLink 🌱

[![Testes e deploy](https://github.com/dansfisica85/site_seederlink-wolvestech/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/dansfisica85/site_seederlink-wolvestech/actions/workflows/deploy-pages.yml)

SeederLink é um projeto acadêmico da FIAP que aproxima investidores de impacto e produtores rurais. A versão atual usa React e acrescenta, no card **Fale Conosco**, um mapa para escolher a localização da propriedade, consultar informações climáticas e executar uma triagem demonstrativa para soja e tomate.

- **Site publicado:** [dansfisica85.github.io/site_seederlink-wolvestech](https://dansfisica85.github.io/site_seederlink-wolvestech/)
- **Repositório:** [github.com/dansfisica85/site_seederlink-wolvestech](https://github.com/dansfisica85/site_seederlink-wolvestech)
- **Tecnologias:** React 18, Vite 5, Leaflet, OpenStreetMap, Open-Meteo, NASA POWER, Node Test Runner e GitHub Actions.

> **Aviso importante:** esta é uma triagem climática acadêmica. Ela não é um laudo agronômico e não concede crédito real. Os dados são modelados para uma célula geográfica e não substituem sensor local, ZARC, análise de solo, disponibilidade de água, cultivar, época de plantio, vistoria técnica ou análise financeira.

## Situação da entrega

| Item | Situação |
| --- | --- |
| Projeto da Fase 4 evoluído em React | Concluído |
| Nova funcionalidade de mapa e clima | Concluída |
| Testes automatizados | 8 casos implementados |
| Deploy público | Concluído no GitHub Pages |
| README e comentários em português | Concluídos |
| Pitch específico da Fase 5, até 3 minutos | **Pendente de gravação** |
| Troca do link do vídeo na Home | **Pendente do novo link** |
| PDF com integrantes, pitch e deploy | **Pendente dos nomes e do novo link** |

O vídeo que aparece atualmente na Home é **“ATIVIDADE – AGROTECH - Sprint 4”**. Ele foi mantido para não inventar um endereço, mas não deve ser apresentado como pitch da Fase 5. O local exato para a troca está em [`src/components/Hero.jsx`](src/components/Hero.jsx). Há um roteiro pronto em [`docs/ROTEIRO_PITCH_FASE_5.md`](docs/ROTEIRO_PITCH_FASE_5.md) e um modelo com o link do deploy em [`ENTREGA_FIAP_FASE_5.txt`](ENTREGA_FIAP_FASE_5.txt).

## O que foi melhorado, passo a passo

### 1. Migração da versão antiga para React

A versão original usava um HTML grande, uma folha CSS e um arquivo JavaScript que modificava diretamente o DOM. A versão atual foi dividida em componentes React. Estados como perfil, parceiro, formulário, popup, coordenada e resultado climático ficam próximos de quem os utiliza.

| Antes | Agora |
| --- | --- |
| Alterações com `innerHTML`, `createElement` e `classList` | JSX e renderização declarativa |
| Variáveis globais | Estados locais com `useState` |
| Eventos criados em um script único | Eventos organizados em componentes |
| Página sem etapa de build | Vite com desenvolvimento, teste, build e preview |
| Publicação manual de arquivos | Teste, build e deploy automatizados pelo GitHub Actions |

Os arquivos antigos [`js/script.js`](js/script.js) e [`css/styles.css`](css/styles.css) foram preservados apenas como histórico. Eles **não são carregados** pela aplicação atual. O `index.html` carrega `src/main.jsx`, que monta o React e importa `src/index.css`.

### 2. Componentização da página

O componente [`src/App.jsx`](src/App.jsx) reúne Navbar, Home, Sobre Nós, Como Funciona, Plataforma, Contato, rodapé, popup e guia interativo. Cada seção tem responsabilidade própria, o que facilita leitura, teste e manutenção.

### 3. Mapa no card de contato

O antigo card estático de localização foi substituído pelo componente [`src/components/MapaClimatico.jsx`](src/components/MapaClimatico.jsx). O usuário pode:

- clicar em qualquer ponto do mapa;
- arrastar o marcador;
- autorizar a geolocalização do navegador;
- digitar latitude e longitude, inclusive usando vírgula decimal.

A área de contato foi reorganizada em uma faixa com dados demonstrativos e uma
grade principal proporcional. Em telas grandes, o formulário usa a coluna mais
compacta e o mapa/análise recebe a coluna maior. Em tablets e celulares, os
blocos passam para uma única coluna e o mapa aparece antes do formulário. Os
campos mantêm rótulos visíveis, tamanho confortável para toque e fonte de 16 px
nos celulares para evitar o zoom automático do navegador.

Antes do mapa, um aviso explica por que a localização é solicitada: ela permite
relacionar as condições climáticas da região às características físicas da
propriedade informadas no atendimento, apoiando a pré-análise de crédito.

### 4. Dados climáticos atuais

Depois da seleção, o site consulta temperatura do ar, umidade relativa e radiação solar atuais na Open-Meteo. O estado de carregamento aparece enquanto a requisição está em andamento, e uma falha é mostrada separadamente, sem ser confundida com reprovação.

### 5. Histórico climático

O sistema pede 365 dias históricos e aceita somente dias que tenham as três métricas. São exigidos pelo menos 350 dias completos. A janela termina sete dias antes da data da consulta para reduzir o risco de usar dados de reanálise ainda não consolidados.

### 6. Cruzamento transparente dos critérios

As médias históricas são comparadas com três referências indicativas. Todos os critérios precisam ser verdadeiros ao mesmo tempo. A interface mostra o valor encontrado, a faixa esperada e se cada item passou.

### 7. Contingência e segurança do resultado

Se o histórico da Open-Meteo falhar ou passar do limite de cinco segundos, o sistema tenta a NASA POWER. Como os provedores usam modelos diferentes, os indicadores alternativos ficam visíveis, mas a aplicação força a análise complementar e nunca gera pré-aprovação automática nessa situação.

### 8. Controle de chamadas e resultados antigos

- uma espera de 450 ms evita consultas repetidas durante ajustes rápidos;
- `AbortController` cancela a chamada anterior quando o ponto muda;
- uma identificação impede um retorno antigo do GPS de sobrescrever uma escolha nova;
- o cache guarda até 20 locais por 30 minutos;
- cada requisição possui limite de tempo.

### 9. Acessibilidade e responsividade

O mapa tem nome acessível, o marcador pode ser ajustado, as coordenadas podem ser digitadas sem mouse e as mudanças são anunciadas por regiões `aria-live`. O formulário possui rótulos ligados aos campos, preenchimento automático apropriado e contador da mensagem. A grade usa pontos de quebra para monitor, notebook, tablet e celular, sem depender de uma largura fixa.

### 10. Testes, CI/CD e documentação

Foram criados oito testes para datas, médias, histórico mínimo, limites, mensagens, coordenadas, URLs e contingência. O workflow testa e gera a build em pull requests; na `main`, também publica o site. O código autoral recebeu comentários simples em português, especialmente nos pontos em que existe estado, efeito, integração ou regra de negócio.

## Onde o mapa está no código

O caminho de renderização é:

```text
index.html
  └─ src/main.jsx                 monta o React na div #root
      └─ src/App.jsx              organiza a página
          └─ src/components/Contato.jsx
              └─ <MapaClimatico />
                  ├─ Leaflet + OpenStreetMap
                  └─ src/lib/climate.js
                      ├─ Open-Meteo atual
                      ├─ Open-Meteo histórico
                      ├─ NASA POWER como contingência
                      └─ cruzamento dos critérios
```

| Parte | Arquivo/função | O que faz |
| --- | --- | --- |
| Posição do card na página | [`Contato.jsx`](src/components/Contato.jsx), tag `<MapaClimatico />` | Coloca o mapa abaixo dos cards de e-mail e telefone, na coluna esquerda do Fale Conosco |
| Componente visual | [`MapaClimatico.jsx`](src/components/MapaClimatico.jsx), `MapaClimatico` | Controla mapa, marcador, coordenadas, carregamento, erros e resultado |
| Criação do mapa | primeiro `useEffect` de `MapaClimatico` | Cria uma instância Leaflet e adiciona os tiles do OpenStreetMap |
| Marcador | segundo `useEffect` de `MapaClimatico` | Cria, move e recebe o fim do arraste do marcador |
| Consulta ao mudar o ponto | terceiro `useEffect` de `MapaClimatico` | Aguarda 450 ms, cancela a chamada anterior e busca o clima |
| GPS do navegador | `useMyLocation` | Solicita a posição somente após o clique do usuário |
| Entrada pelo teclado | `selectTypedCoordinates` | Converte, valida e centraliza latitude/longitude digitadas |
| Estilos | bloco “MAPA E TRIAGEM CLIMÁTICA” de [`src/index.css`](src/index.css) | Define mapa, métricas, critérios, mensagens e responsividade |

O projeto usa **Leaflet diretamente dentro de efeitos React**, e não a biblioteca React Leaflet. Isso permite controlar explicitamente a criação e a desmontagem do objeto externo:

```jsx
// Contato.jsx
<MapaClimatico />

// MapaClimatico.jsx — ideia resumida
useEffect(() => {
  const map = L.map(mapElementRef.current).setView(INITIAL_POSITION, 5);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  return () => map.remove();
}, []);
```

## Como a seleção percorre o sistema

1. Clique, arraste, GPS ou formulário chama `selectLocation`.
2. `selectLocation` arredonda a coordenada para cinco casas e atualiza `selectedLocation`.
3. O efeito do marcador sincroniza o Leaflet com esse estado.
4. O efeito da consulta espera 450 ms.
5. [`fetchClimateForLocation`](src/lib/climate.js) monta as URLs e verifica o cache.
6. Condições atuais e histórico são buscados em paralelo.
7. O histórico é validado e resumido.
8. `evaluateClimateSuitability` cruza as três médias.
9. O resultado volta ao estado React e o JSX mostra métricas, critérios, fonte e mensagem.

Esse desenho mantém uma única fonte de verdade: a coordenada guardada no estado React. O Leaflet mostra o mapa, mas não decide o resultado.

## De onde vêm as informações climáticas

Os endereços são montados em `buildClimateUrls`, dentro de [`src/lib/climate.js`](src/lib/climate.js).

| Grupo | Provedor e rota | Campos solicitados | Unidade exibida |
| --- | --- | --- | --- |
| Atual | Open-Meteo Forecast API | `temperature_2m` | °C |
| Atual | Open-Meteo Forecast API | `relative_humidity_2m` | % |
| Atual | Open-Meteo Forecast API | `shortwave_radiation` | W/m² |
| Histórico principal | Open-Meteo Historical Weather API | `temperature_2m_mean` | °C |
| Histórico principal | Open-Meteo Historical Weather API | `relative_humidity_2m_mean` | % |
| Histórico principal | Open-Meteo Historical Weather API | `shortwave_radiation_sum` | MJ/m²/dia |
| Histórico alternativo | NASA POWER Daily Point API | `T2M`, `RH2M`, `ALLSKY_SFC_SW_DWN` | mesmas unidades históricas após normalização |
| Mapa | OpenStreetMap | tiles `{z}/{x}/{y}` | cartografia visual |

No histórico principal, o parâmetro `models=era5_seamless` é usado. A NASA POWER retorna datas e valores em outro formato; `normalizeNasaPowerDaily` converte essa resposta e descarta valores de preenchimento, como `-999`.

Fontes oficiais:

- [Open-Meteo — Forecast API](https://open-meteo.com/en/docs)
- [Open-Meteo — Historical Weather API](https://open-meteo.com/en/docs/historical-weather-api)
- [NASA POWER — Daily API](https://power.larc.nasa.gov/docs/services/api/temporal/daily/)
- [Leaflet — referência de mapas, eventos e marcadores](https://leafletjs.com/reference.html)
- [OpenStreetMap — política dos tiles](https://operations.osmfoundation.org/policies/tiles/)

## Como funciona a função que cruza as informações

A regra está em `evaluateClimateSuitability`, dentro de [`src/lib/climate.js`](src/lib/climate.js). Ela recebe as três médias calculadas por `summarizeHistoricalDaily`.

```text
temperaturaPassou = 20 <= temperatura média <= 27
umidadePassou     = 60 <= umidade média <= 80
radiacaoPassou    = radiação média >= 8,5

resultadoPositivo = temperaturaPassou
                 E umidadePassou
                 E radiacaoPassou
```

No código, o operador lógico conjunto aparece assim:

```js
const suitable = Object.values(checks).every(Boolean);
```

`every(Boolean)` só retorna `true` quando os três valores de `checks` são verdadeiros. Por isso:

- se os três passam, a interface mostra: **“Parabéns, seu crédito foi pré-aprovado. Nosso consultor retornará o contato. Aguarde.”**
- se pelo menos um falha, mostra: **“Ainda precisamos conversar com o(a) Sr(a), um pouco mais. Aguarde o contato do nosso consultor.”**
- se os dados são insuficientes ou os serviços falham, mostra um erro de consulta, e não uma mensagem de crédito;
- se a NASA POWER foi necessária, mostra os indicadores, mas força a segunda mensagem por segurança.

### Critérios usados

| Critério histórico | Faixa demonstrativa |
| --- | --- |
| Temperatura média | 20 °C a 27 °C |
| Umidade relativa média | 60% a 80% |
| Radiação solar média | mínimo de 8,5 MJ/m²/dia |

As faixas são **referências acadêmicas indicativas**, não uma definição universal de aptidão conjunta para soja e tomate. A temperatura usa uma interseção compatível com as referências consultadas; a umidade de 60% a 80% é especialmente relacionada ao tomate em ambiente protegido; e o mínimo de radiação vem de referência para hortaliças termófilas que inclui o tomate. Uma avaliação real deve considerar cultura, cultivar, solo, água e período de plantio, além do ZARC.

Referências agronômicas:

- [Embrapa Soja — exigências climáticas e temperatura](https://bioinfo.cnpso.embrapa.br/seca/index.php?Itemid=435&catid=84&id=73%3Aexigencias-climaticas&option=com_content&view=article)
- [FAO — Good Agricultural Practices for Greenhouse Vegetable Crops](https://www.fao.org/4/i3284e/i3284e.pdf)
- [Embrapa — produção de tomate em ambiente protegido](https://ainfo.cnptia.embrapa.br/digital/bitstream/item/80343/1/BritoJr-prod-tomate.pdf)
- [MAPA — Zoneamento Agrícola de Risco Climático](https://www.gov.br/agricultura/pt-br/assuntos/riscos-seguro/programa-nacional-de-zoneamento-agricola-de-risco-climatico)

## Tratamento de falhas e qualidade dos dados

| Situação | Comportamento |
| --- | --- |
| Latitude fora de -90 a 90 | A consulta é bloqueada com mensagem clara |
| Longitude fora de -180 a 180 | A consulta é bloqueada com mensagem clara |
| Menos de 350 dias completos | Nenhuma triagem é emitida |
| Seleção muda durante a consulta | A chamada anterior é cancelada |
| Open-Meteo histórica falha ou demora mais de 5 s | NASA POWER é tentada |
| NASA POWER usada | Resultado automaticamente conservador, sem pré-aprovação |
| Os dois históricos falham | Estado de erro próprio |
| Mesmo local consultado novamente em até 30 min | Resultado recente vem do cache |

## Estrutura do projeto

```text
site_seederlink-wolvestech/
├─ .github/workflows/deploy-pages.yml   # teste, build e deploy
├─ docs/ROTEIRO_PITCH_FASE_5.md         # roteiro de até 3 minutos
├─ public/img/                           # imagens usadas pelo Vite
├─ src/
│  ├─ components/                       # componentes React da página
│  │  ├─ Contato.jsx                    # insere o MapaClimatico
│  │  └─ MapaClimatico.jsx              # mapa, marcador e apresentação
│  ├─ data/                              # dados simulados e dicas do guia
│  ├─ hooks/useScrollAnimation.js        # animações observadas
│  ├─ lib/climate.js                     # APIs, médias, regra e cache
│  ├─ App.jsx                            # composição da aplicação
│  ├─ index.css                          # estilos ativos
│  └─ main.jsx                           # entrada do React
├─ tests/climate.test.js                 # testes automatizados
├─ css/styles.css                        # CSS legado, não executado
├─ js/script.js                          # JavaScript legado, não executado
├─ ENTREGA_FIAP_FASE_5.txt               # dados conhecidos e pendências
├─ index.html                            # raiz com a div #root
├─ package.json                          # scripts e dependências
├─ package-lock.json                     # versões exatas geradas pelo npm
└─ vite.config.js                        # base de publicação e porta local
```

### Como os comentários foram organizados

Os comentários estão em português e em linguagem simples, com frases como “Aqui eu valido...” e “Neste efeito eu crio...”. Eles explicam intenção, fluxo, unidade, integração e decisões de segurança. Não há comentários em cada linha óbvia para não deixar o código mais difícil de ler.

`package.json`, `package-lock.json` e `.vscode/settings.json` são JSON estrito. JSON não aceita `//` nem `/* */`; por isso, inserir comentários nesses arquivos quebraria as ferramentas. Os scripts e dependências são explicados neste README, e o lockfile deve continuar sendo gerado automaticamente pelo npm.

## Como executar, passo a passo

### Pré-requisitos

- Node.js 20 ou superior;
- npm, que acompanha o Node.js;
- internet para carregar mapa, fontes e APIs climáticas.

### 1. Baixar e entrar no projeto

```bash
git clone https://github.com/dansfisica85/site_seederlink-wolvestech.git
cd site_seederlink-wolvestech
```

### 2. Instalar exatamente as versões registradas

```bash
npm ci
```

Use `npm install` quando estiver alterando dependências. Para apenas executar ou avaliar o projeto, `npm ci` é mais reproduzível porque segue o `package-lock.json`.

### 3. Iniciar o modo de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000/](http://localhost:3000/). O Vite atualiza a tela após mudanças salvas no código.

### 4. Testar

```bash
npm test
```

Os oito testes verificam:

1. janela histórica inclusiva de 365 dias;
2. média somente com dias completos;
3. bloqueio de histórico insuficiente;
4. aprovação nos limites e texto exato;
5. análise complementar quando um critério falha;
6. coordenadas, URLs, período e ausência de chave;
7. normalização e descarte do valor `-999` da NASA;
8. contingência conservadora sem pré-aprovação.

### 5. Gerar a build de produção

```bash
npm run build
```

O Vite cria a pasta `dist/`. Ela é resultado de build: não deve ser editada manualmente nem incluída no ZIP de código-fonte.

### 6. Conferir a build localmente

```bash
npm run preview
```

### Scripts do `package.json`

| Comando | Função |
| --- | --- |
| `npm run dev` | inicia o Vite na porta 3000 |
| `npm test` | executa `tests/*.test.js` com o test runner do Node |
| `npm run build` | gera a versão otimizada em `dist/` |
| `npm run preview` | serve localmente a build já gerada |

### Dependências principais

| Pacote | Uso |
| --- | --- |
| `react` e `react-dom` | componentes, estados, efeitos e renderização |
| `leaflet` | mapa, tiles, eventos e marcador |
| `bootstrap-icons` | ícones visuais |
| `vite` e `@vitejs/plugin-react` | ambiente local e build |

## Deploy

### GitHub Pages — usado neste projeto

O workflow [`deploy-pages.yml`](.github/workflows/deploy-pages.yml) executa:

```text
checkout → Node 20 → npm ci → npm test → npm run build → upload → deploy
```

Em pull requests, ele testa e gera a build. Na branch `main`, também publica. A variável `VITE_BASE_PATH=/site_seederlink-wolvestech/` informa ao Vite a subpasta correta.

Passo a passo para conferir:

1. Abra **Actions** no GitHub.
2. Entre em **Test and deploy GitHub Pages**.
3. Confirme que `build` e `deploy` estão verdes.
4. Abra o [site público](https://dansfisica85.github.io/site_seederlink-wolvestech/) em janela anônima.
5. Role até **Fale Conosco**, selecione um ponto e confira mapa, dados, fonte e mensagem.

Referências de publicação:

- [GitHub — usar workflow personalizado no Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Vite — publicação de site estático](https://vite.dev/guide/static-deploy)

### Vercel — alternativa mostrada nos tutoriais

O enunciado permite Vercel **ou outro provedor gratuito**; por isso, o GitHub Pages atende ao requisito de hospedagem. Se a equipe quiser duplicar a publicação na Vercel, use:

- Framework Preset: `Vite`;
- Build Command: `npm run build`;
- Output Directory: `dist`;
- Install Command: `npm ci`;
- Root Directory: raiz do projeto.

Os quatro tutoriais da imagem foram conferidos:

| Vídeo | Conteúdo e relação com este projeto |
| --- | --- |
| [Deploy de projeto React na Vercel — React, Vite e Vercel](https://youtu.be/e_92Fz99q18) | Diretamente aplicável: CLI da Vercel, build do Vite, pasta `dist` e atualização do deploy |
| [Deploy API Node grátis na Vercel](https://youtu.be/8jttLYYDWjo) | Explica backend Node/TypeScript e `vercel.json`; é apoio, mas este site é somente front-end |
| [Curso Next.js: Deploy na Vercel](https://youtu.be/UIg8MAzxtlg) | Mostra build e importação de repositório Next.js; é contextual, porque SeederLink usa Vite |
| [Como hospedar seu projeto online com Vercel e GitHub](https://youtu.be/e7L_8XVQBik) | Diretamente útil para conectar o repositório, selecionar Vite, definir a raiz e atualizar a cada commit |

Os vídeos são tutoriais de procedimento. Os requisitos obrigatórios da entrega continuam sendo os textos da atividade: React, uma nova funcionalidade, pitch de até três minutos, link na Home, deploy, PDF com nomes e links e um ZIP sem o arquivo do vídeo.

## Checklist estrito da entrega FIAP

1. Manter React em toda a versão da Fase 5 — concluído.
2. Apresentar uma nova funcionalidade — mapa e triagem climática concluídos.
3. Publicar o site — concluído no GitHub Pages.
4. Gravar um pitch de até três minutos mostrando **somente a nova funcionalidade** — pendente.
5. Explicar no pitch como React foi usado — roteiro preparado.
6. Publicar o pitch no YouTube ou plataforma equivalente — pendente.
7. Trocar o link da Home pelo pitch novo — pendente do endereço.
8. Criar um PDF com nomes completos, link do pitch e link do deploy — pendente dos dados.
9. Testar os links depois de gerar o PDF — pendente.
10. Entregar um ZIP com projeto e PDF, sem o arquivo do vídeo — o pacote técnico pode ser gerado agora; o pacote acadêmico final depende do PDF.

## Limites dos serviços gratuitos

A API pública da Open-Meteo, sem chave, é indicada para uso não comercial e possui limites, sem SLA. Para operação comercial, é necessário contratar licença/plano adequado ou hospedar infraestrutura compatível. Os tiles comunitários do OpenStreetMap também operam em melhor esforço e sem SLA. Um produto real em escala deve contratar provedores com capacidade e termos compatíveis.

- [Open-Meteo — planos, licença e limites](https://open-meteo.com/en/pricing)
- [OpenStreetMap — política de uso dos tiles](https://operations.osmfoundation.org/policies/tiles/)

## Segurança e privacidade

- As APIs usadas nesta demonstração não exigem token no navegador.
- Nenhuma senha, token ou arquivo `.env` deve entrar no Git ou no ZIP.
- A geolocalização só é solicitada após ação do usuário e depende da permissão do navegador.
- O formulário atual exibe uma confirmação visual, mas não envia os dados para um backend.
- Uma futura decisão de crédito real precisa de consentimento, LGPD, autenticação, trilha de auditoria, regras aprovadas por especialistas e revisão humana.

## Resumo técnico da nova funcionalidade

```text
Usuário escolhe um ponto
        ↓
React valida e guarda latitude/longitude
        ↓
Leaflet move o marcador
        ↓
Open-Meteo atual + histórico (em paralelo)
        ↓
NASA POWER se o histórico principal falhar
        ↓
350+ dias completos → três médias
        ↓
temperatura E umidade E radiação
        ↓
mensagem positiva ou análise complementar
```

Esse fluxo é visível tanto na interface quanto nos comentários de [`MapaClimatico.jsx`](src/components/MapaClimatico.jsx) e [`climate.js`](src/lib/climate.js).
