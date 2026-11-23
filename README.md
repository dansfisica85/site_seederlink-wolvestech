# SeederLink · Fase 7

**Continuação solo da Carteira de Propriedades**, a partir da base acadêmica da Fase 6.

Projeto acadêmico FIAP. A interface permanece em React. Este repositório é a entrega individual da Fase 7 (Mateus Augusto), com dependências atualizadas, testes, build e publicação via GitHub Pages.

- [Site no GitHub Pages](https://devourerhope.github.io/site_seederlink-fase7/)
- [Repositório](https://github.com/DevourerHope/site_seederlink-fase7)
- [Diagrama UML em imagem](public/docs/diagrama-classes-fase6.png)
- [Roteiro do pitch da Fase 6 (referência)](docs/ROTEIRO_PITCH_FASE_6.md)
- [Checklist da Fase 6 (referência)](docs/CHECKLIST_ENTREGA_FASE6.md)

> Demonstração acadêmica: a triagem não concede crédito real nem determina aptidão agrícola. A carteira usa `localStorage`, sem conta, servidor ou sincronização entre dispositivos. O formulário de contato herdado valida e exibe confirmação visual, mas não envia e-mail.

## Integrantes

| Nome completo | RM |
| --- | --- |
| MATEUS AUGUSTO DA COSTA OLIVEIRA GONÇALVES | 570166 |
| MATHEUS RISSATO CRISPIM | 571038 |
| ISAAC NILTON ALVARENGA DA SILVA | 573766 |

## Conquistas da Fase 5

| Entregável | Status |
| --- | --- |
| Projeto da Fase 4 evoluído em React | Concluído |
| Nova funcionalidade de mapa e clima | Concluída |
| Testes automatizados | 8 casos implementados |
| Deploy público | Concluído no GitHub Pages |
| README e comentários em português | Concluídos |
| Pitch específico da Fase 5, até 3 minutos | Concluído e publicado |
| Troca do link do vídeo na Home | Concluída |
| PDF com integrantes, pitch e deploy | Concluído para o pacote final |

O pitch da Fase 5 está publicado no [YouTube](https://youtu.be/U3APiszPvXw?is=fQs4xrjZObVEhg0c) e aparece na Home por meio do link definido em [`src/components/Hero.jsx`](src/components/Hero.jsx). O roteiro está em [`docs/ROTEIRO_PITCH_FASE_5.md`](docs/ROTEIRO_PITCH_FASE_5.md), e os dados formais da entrega estão em [`ENTREGA_FIAP_FASE_5.txt`](ENTREGA_FIAP_FASE_5.txt).

## Base herdada da Fase 6

| Preservado | Estado nesta Fase 7 |
| --- | --- |
| Mapa, consulta climática e carteira | Funcionais como na Fase 6 |
| Cinco classes de domínio e UML | Mantidos como base |
| Deploy via GitHub Actions | Novo repositório solo + Pages |
| Documentação da Fase 6 | Conservada em `docs/` como referência |

O README da Fase 5 permanece em [docs/README_FASE5_REFERENCIA.md](docs/README_FASE5_REFERENCIA.md). A comparação Fase 5 → 6 está em [docs/COMPARACAO_FASE5_FASE6.md](docs/COMPARACAO_FASE5_FASE6.md).

## Executar localmente

Instale Node.js 22.12+ (recomendado 24 LTS, ver `.nvmrc`), abra a pasta no VS Code e execute:

```bash
npm ci
npm test
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:3000`. Para conferir a produção:

```bash
npm run build
npm run preview
```

Não abra `index.html` por duplo clique: JSX precisa do Vite. Não há token climático nem banco remoto para configurar.

## Usar a carteira

1. No **Fale Conosco**, clique no mapa, arraste o marcador, digite latitude/longitude ou autorize a localização do navegador.
2. Aguarde o resultado. Enquanto houver carregamento ou erro, não aparece a ação de salvar aquela consulta.
3. Clique em **Salvar esta análise na carteira**. O foco vai para a seção **Propriedades**.
4. Confira coordenadas, fonte e período; preencha nome, cultura (soja/tomate) e área em hectares. Vírgula decimal é aceita.
5. Clique em **Salvar propriedade**. O registro permanece após recarregar a página.
6. Cadastre outra propriedade; marque duas opções **Comparar** e clique em **Comparar selecionadas**.
7. Confira cultura, área, coordenadas, médias, período, dias válidos, fonte, captura e triagem.
8. Para atualizar um histórico, consulte a mesma coordenada e escolha **Atualizar histórico** no destino.
9. **Exportar JSON** baixa uma cópia legível. A remoção pede confirmação.

**Privacidade:** os dados ficam neste navegador e nesta origem. `localhost`, GitHub Pages e outros domínios têm carteiras separadas.

## Stack e dependências

- React 18 + Vite 7 + `@vitejs/plugin-react` 5
- Leaflet 1.9.4 e Bootstrap Icons
- Node.js `>=22.12.0` (CI usa a versão do `.nvmrc`)

## Testes

```bash
npm test
```

Os testes validam período histórico, descarte de valores ausentes, quantidade mínima de dias, limites climáticos, coordenadas, URLs e o texto exato das duas mensagens.

Para testar a interface, execute `npm run dev -- --port 4176 --open false` em um terminal e, em outro:

```bash
npx playwright install chromium
npm run test:ui
```

## Deploy

### GitHub Pages

O provedor principal é GitHub Pages. Em Settings > Pages, a origem deve ser **GitHub Actions**. O workflow `.github/workflows/deploy-pages.yml` instala dependências, executa testes e build e publica a `main`, usando `VITE_BASE_PATH=/site_seederlink-wolvestech/`. Pull requests são testados sem publicar.

Após enviar uma alteração, aguarde `build` e `deploy` concluírem e confira o site em janela anônima. Nunca envie `.env`, credenciais ou `node_modules`.

### Vercel

Para deploy na [Vercel](https://vercel.com):

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub.
2. Clique em **"Add New..."** → **"Project"**.
3. Selecione este repositório na lista de projetos do GitHub.
4. Na configuração do projeto, use as configurações padrão (o Vercel detecta automaticamente o Vite).
5. Clique em **"Deploy"**.

O arquivo `vercel.json` já está configurado para:
- Build automático com `npm run build`
- SPA routing (todas as rotas redirecionam para `index.html`)
- Diretório de saída: `dist/`

Após o deploy, o site estará disponível em `https://seu-projeto.vercel.app`.

**Deploy automático:** Cada push na branch `main` dispara um novo deploy automaticamente.

## Pitch

O pitch da Fase 7 ainda não foi publicado. Enquanto isso, a Home aponta para o [pitch da Fase 6](https://youtu.be/BJ_unP9lmys) como referência. Quando o vídeo novo estiver público, atualize `pitchUrl` em `src/data/entrega.js`, rode os testes e faça o deploy.

### Deploy na Vercel

Para publicar na Vercel, utilize:
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
4. Gravar um pitch de até três minutos mostrando **somente a nova funcionalidade** — concluído.
5. Explicar no pitch como React foi usado — roteiro preparado.
6. Publicar o pitch no YouTube ou plataforma equivalente — concluído.
7. Trocar o link da Home pelo pitch novo — concluído.
8. Criar um PDF com nomes completos, link do pitch e link do deploy — concluído para o pacote final.
9. Testar os links depois de gerar o PDF — incluído na conferência final.
10. Entregar um ZIP com projeto e PDF, sem o arquivo do vídeo — incluído no pacote final.

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
