# Checklist da entrega - Fase 7

Conferência de fechamento: **_/_/_** _(preencher)_.

Este documento mostra onde cada requisito aparece no projeto e separa o que foi verificado das limitações de acesso aos tutoriais.

## Requisitos e evidências

| Item | Requisito | Evidência na entrega |
| --- | --- | --- |
| 1.1.1 | Usar a Fase 6 como referência. | Base do código em `src/`, documentação em `docs/COMPARACAO_FASE6_FASE7.md` |
| 1.1.2 | React em toda a interface da Fase 7. | 12 componentes React em `src/components/` |
| 1.1.3 | Nova funcionalidade da Fase 7. | ESLint, acessibilidade (inputs com `id`/`htmlFor`), favicon, meta tags SEO/Open Graph, deploy na Vercel |
| 1.2.1 | Classes com atributos, métodos e relacionamentos. | 6 classes em `src/domain/portfolio.js` |
| 1.2.1 | Modelar em ferramenta UML e entregar imagem no PDF. | `docs/DIAGRAMA_CLASSES_FASE7.mmd` (Mermaid) |
| 1.3.1 | Pitch de até três minutos. | Pendente — roteiro em `docs/ROTEIRO_PITCH_FASE_7.md` |
| 1.3.1 | Vídeo público e link na Home. | `src/data/entrega.js` → `pitchUrl` (referência Fase 6) |
| 1.3.1 | Integrante e link do vídeo no PDF; não enviar a mídia. | Pendente |
| 1.4.1 a 1.4.3 | Site publicado e link no PDF. | Configurado na Vercel com `vercel.json` |
| 1.5 | Site / UML / vídeo (pesos da atividade). | Pendente |
| 1.6 e 1.7 | ZIP externo com PDF e projeto compactado. | Pendente |

## Tutoriais de deploy

| Tutorial | O que foi conferido | Como foi aplicado ou delimitado |
| --- | --- | --- |
| [Deploy de projeto React na Vercel](https://youtu.be/e_92Fz99q18) | CLI da Vercel, build do Vite, pasta `dist` | Diretamente aplicável |
| [Como hospedar seu projeto online com Vercel e GitHub](https://youtu.be/e7L_8XVQBik) | Conectar repositório, selecionar Vite, atualizar a cada commit | Diretamente útil |

## Publicação reproduzível

1. O `package.json` e o lockfile ficam na raiz do projeto.
2. `npm ci` instala as dependências declaradas.
3. `npm test` valida as regras e os links da entrega (25 testes).
4. `npm run build` gera `dist`.
5. O deploy é feito na Vercel com `vercel.json`.

## Observações

- Repositório: https://github.com/DevourerHope/SeederLink-Fase-7
- Integrantes: Mateus Augusto (RM 570166), Matheus Rissato (RM 571038), Isaac Nilton (RM 573766)
- Deploy: Vercel (GitHub Pages removido)
