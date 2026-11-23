# Comparação — SeederLink da Fase 6 para a Fase 7

## Referência utilizada

A referência é o projeto da Fase 6 (Carteira de Propriedades), publicado no repositório do grupo e migrado para o repositório solo da Fase 7:

- Base anterior: https://github.com/dansfisica85/site_seederlink-wolvestech
- Entrega solo: https://github.com/DevourerHope/SeederLink-Fase-7

Na Fase 6, a nova funcionalidade era a **Carteira de Propriedades**. Na Fase 7, as melhorias incluem **ESLint, acessibilidade, meta tags SEO/Open Graph, favicon, e deploy na Vercel**.

## O que mudou

| Aspecto | Base da Fase 6 | Evolução da Fase 7 |
| --- | --- | --- |
| Interface | React com carteira, mapa e seções ativas. | Mesma interface com melhorias de acessibilidade (inputs com `id`/`htmlFor`) |
| Nova função | Carteira: cadastro, histórico, comparação e exportação. | ESLint configurado, favicon, meta tags SEO, deploy na Vercel |
| Persistência | `localStorage` da carteira. | Mantido |
| Modelagem / UML | Cinco classes em `src/domain/portfolio.js`. | Expandido para 6 classes com diagrama Mermaid |
| Deploy | GitHub Pages do grupo. | Vercel com `vercel.json` |
| Autoria | Quatro integrantes. | Entrega individual — RM 570166 |
| Pitch | https://youtu.be/BJ_unP9lmys | Pendente — roteiro em `docs/ROTEIRO_PITCH_FASE_7.md` |
| Testes | 8 casos | 25 casos |
| Lint | Não configurado | ESLint com 0 erros |

## Fluxo da nova funcionalidade

1. ESLint verifica código automaticamente com `npm run lint`
2. Inputs de formulário recebem `id` e labels usam `htmlFor` para acessibilidade
3. Meta tags SEO e Open Graph melhoram compartilhamento em redes sociais
4. Favicon elimina erro 404 do console
5. Deploy automatizado na Vercel a cada push na `main`

## Como as classes organizam a solução

| Classe | Informações principais | Comportamentos e responsabilidade |
| --- | --- | --- |
| PortfolioError | Mensagem, tipo, coordenadas | Erros tipados do domínio |
| Localizacao | Latitude, longitude, endereço | Validação de coordenadas |
| AnaliseClimatica | Médias, período, fonte | Avaliação de suitability |
| PropriedadeRural | Nome, cultura, área, análise | Registro na carteira |
| CarteiraPropriedades | Lista de propriedades | CRUD, comparação, exportação |
| RepositorioLocal | Chave, dados | Persistência com localStorage |

## Entrega da Fase 7

- Site: Configurado na Vercel
- Repositório: https://github.com/DevourerHope/SeederLink-Fase-7
- Pitch: Pendente
- Roteiro: [ROTEIRO_PITCH_FASE_7.md](ROTEIRO_PITCH_FASE_7.md)
