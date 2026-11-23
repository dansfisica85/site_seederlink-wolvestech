# SeederLink · Fase 7

**Continuação solo da Carteira de Propriedades**, a partir da base acadêmica da Fase 6.

Projeto acadêmico FIAP. A interface permanece em React. Esta entrega individual da Fase 7 (Mateus Augusto) inclui melhorias de código, configuração do ESLint, acessibilidade, deploy na Vercel e documentação atualizada.

- [Repositório](https://github.com/DevourerHope/SeederLink-Fase-7)
- [Diagrama de classes (Mermaid)](docs/DIAGRAMA_CLASSES_FASE7.mmd)
- [Roteiro do pitch da Fase 7](docs/ROTEIRO_PITCH_FASE_7.md)
- [Checklist da Fase 7](docs/CHECKLIST_ENTREGA_FASE7.md)
- [Comparação Fase 6 → 7](docs/COMPARACAO_FASE6_FASE7.md)

> Demonstração acadêmica: a triagem não concede crédito real nem determina aptidão agrícola. A carteira usa `localStorage`, sem conta, servidor ou sincronização entre dispositivos. O formulário de contato herdado valida e exibe confirmação visual, mas não envia e-mail.

## Integrantes

| Nome completo | RM |
| --- | --- |
| MATEUS AUGUSTO DA COSTA OLIVEIRA GONÇALVES | 570166 |
| MATHEUS RISSATO CRISPIM | 571038 |
| ISAAC NILTON ALVARENGA DA SILVA | 573766 |

## O que mudou na Fase 7

| Entregável | Status |
| --- | --- |
| Mapa, consulta climática e carteira | Mantidos da Fase 6 |
| ESLint configurado | 0 erros em todos os arquivos |
| Acessibilidade | Inputs com `id` e `htmlFor` nos labels |
| Favicon | Adicionado para eliminar erro 404 |
| Meta tags SEO e Open Graph | Adicionadas no `index.html` |
| Testes automatizados | 25 casos implementados |
| Deploy público | Configurado na Vercel |
| README e comentários em português | Concluídos |
| Diagrama de classes atualizado | Mermaid em `docs/` |

## Base herdada da Fase 6

| Preservado | Estado nesta Fase 7 |
| --- | --- |
| Mapa, consulta climática e carteira | Funcionais como na Fase 6 |
| Classes de domínio e UML | Expandido para 6 classes |
| Deploy via Vercel | Configurado com `vercel.json` |
| Documentação das fases anteriores | Conservada em `docs/` como referência |

O README da Fase 5 permanece em [docs/README_FASE5_REFERENCIA.md](docs/README_FASE5_REFERENCIA.md). A comparação Fase 5 → 6 está em [docs/COMPARACAO_FASE5_FASE6.md](docs/COMPARACAO_FASE5_FASE6.md). A comparação Fase 6 → 7 está em [docs/COMPARACAO_FASE6_FASE7.md](docs/COMPARACAO_FASE6_FASE7.md).

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

**Privacidade:** os dados ficam neste navegador e nesta origem. `localhost`, Vercel e outros domínios têm carteiras separadas.

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

Após o deploy, o site estará disponível em `https://seederlink-fase-7.vercel.app`.

**Deploy automático:** Cada push na branch `main` dispara um novo deploy automaticamente.

## Pitch

O pitch da Fase 7 ainda não foi publicado. Enquanto isso, a Home aponta para o [pitch da Fase 6](https://youtu.be/BJ_unP9lmys) como referência. Quando o vídeo novo estiver público, atualize `pitchUrl` em `src/data/entrega.js`, rode os testes e faça o deploy.

Os tutoriais de deploy consultados:

| Vídeo | Conteúdo e relação com este projeto |
| --- | --- |
| [Deploy de projeto React na Vercel — React, Vite e Vercel](https://youtu.be/e_92Fz99q18) | Diretamente aplicável: CLI da Vercel, build do Vite, pasta `dist` e atualização do deploy |
| [Deploy API Node grátis na Vercel](https://youtu.be/8jttLYYDWjo) | Explica backend Node/TypeScript e `vercel.json`; é apoio, mas este site é somente front-end |
| [Curso Next.js: Deploy na Vercel](https://youtu.be/UIg8MAzxtlg) | Mostra build e importação de repositório Next.js; é contextual, porque SeederLink usa Vite |
| [Como hospedar seu projeto online com Vercel e GitHub](https://youtu.be/e7L_8XVQBik) | Diretamente útil para conectar o repositório, selecionar Vite, definir a raiz e atualizar a cada commit |

Os vídeos são tutoriais de procedimento. Os requisitos obrigatórios da entrega continuam sendo os textos da atividade: React, uma nova funcionalidade, pitch de até três minutos, link na Home, deploy, PDF com nomes e links e um ZIP sem o arquivo do vídeo.

## Checklist estrito da entrega FIAP — Fase 7

1. Manter React em toda a interface — concluído.
2. Apresentar uma nova funcionalidade em relação à Fase 6 — ESLint, acessibilidade, SEO e deploy na Vercel concluídos.
3. Publicar o site — configurado na Vercel.
4. Gravar um pitch de até três minutos mostrando **somente a nova funcionalidade** — roteiro preparado em `docs/ROTEIRO_PITCH_FASE_7.md`.
5. Explicar no pitch como React foi usado — roteiro preparado.
6. Publicar o pitch no YouTube ou plataforma equivalente — pendente.
7. Trocar o link da Home pelo pitch novo — pendente após publicação.
8. Criar um PDF com nomes completos, link do pitch e link do deploy — pendente.
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
