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

- React 19 + Vite 8 + `@vitejs/plugin-react` 6
- Leaflet 1.9.4 e Bootstrap Icons
- Node.js `>=22.12.0` (CI usa a versão do `.nvmrc`)

## Testes

```bash
npm test
npm run build
```

Para testar a interface, execute `npm run dev -- --port 4176 --open false` em um terminal e, em outro:

```bash
npx playwright install chromium
npm run test:ui
```

## Deploy

O provedor é GitHub Pages. Em Settings > Pages, a origem deve ser **GitHub Actions**. O workflow `.github/workflows/deploy-pages.yml` instala dependências, executa testes e build e publica a `main`, usando `VITE_BASE_PATH=/site_seederlink-fase7/`. Pull requests são testados sem publicar.

Após enviar uma alteração, aguarde `build` e `deploy` concluírem e confira o site em janela anônima. Nunca envie `.env`, credenciais ou `node_modules`.

## Pitch

O pitch da Fase 7 ainda não foi publicado. Enquanto isso, a Home aponta para o [pitch da Fase 6](https://youtu.be/BJ_unP9lmys) como referência. Quando o vídeo novo estiver público, atualize `pitchUrl` em `src/data/entrega.js`, rode os testes e faça o deploy.
