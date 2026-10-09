# Checklist da entrega - Fase 6

Conferência de fechamento: **08/10/2026**. Este documento mostra onde cada requisito aparece no projeto e separa o que foi verificado das limitações de acesso aos tutoriais.

## Requisitos e evidências

| Item | Requisito | Evidência na entrega |
| --- | --- | --- |
| 1.1.1 | Usar a Fase 5 como referência. | Base React preservada; comparação em `COMPARACAO_FASE5_FASE6.md` e README histórico em `README_FASE5_REFERENCIA.md`. |
| 1.1.2 | React em toda a interface da Fase 6. | `src/main.jsx` inicia `App.jsx`; as seções ativas são componentes React. Os arquivos HTML/CSS/JS antigos indicados como referência não são uma aplicação paralela. |
| 1.1.3 | Nova funcionalidade. | Carteira de Propriedades: cadastro, persistência local, histórico, comparação de dois registros e exportação JSON. |
| 1.2.1 | Pelo menos três classes com atributos, métodos e relacionamentos. | Cinco classes implementadas em `src/domain/portfolio.js`: Localizacao, AnaliseClimatica, PropriedadeRural, CarteiraPropriedades e RepositorioLocal. Agregação, composição e dependência explicitadas; não foi criada herança sem necessidade. |
| 1.2.1 | Modelar em ferramenta UML e entregar imagem no PDF. | Mermaid editável em `DIAGRAMA_CLASSES.mmd`; PNG e SVG em `public/docs`; o PNG está incorporado na página 2 do PDF, em A4 paisagem. |
| 1.3.1 | Pitch de até três minutos sobre a nova função e o UML. | [Pitch da Fase 6](https://youtu.be/BJ_unP9lmys), 175 segundos no player. Roteiro explica a carteira, atributos, métodos e relações; a gravação-base contém essas telas. |
| 1.3.1 | Vídeo público e link na Home. | Visibilidade Público salva no YouTube Studio, confirmada por consulta sem login. `src/data/entrega.js` fornece o link usado por `Hero.jsx`. |
| 1.3.1 | Integrantes e link do vídeo no PDF; não enviar a mídia. | Página 1 contém os quatro nomes completos/RMs e o link clicável. O empacotador exclui MP4, WebM e outros vídeos. |
| 1.4.1 a 1.4.3 | Site publicado e link no PDF. | [GitHub Pages](https://dansfisica85.github.io/site_seederlink-wolvestech/), provedor permitido pela alternativa expressa no enunciado. O endereço também aparece na página 1 do PDF. |
| 1.5 | Site 50%, UML 25%, vídeo 25%. | Os três itens têm artefatos identificados; esta conferência não atribui nem garante nota. |
| 1.6 e 1.7 | Um ZIP externo com PDF e projeto compactado. | `RM571722_DaviANS_FASE_6_SPRINT6.zip` contém somente o PDF e `01_Projeto_SeederLink_Fase6.zip`. O aluno envia o ZIP externo à plataforma. |

O PDF reúne nomes, RMs, imagem do diagrama e links do vídeo e do deploy. O projeto compactado inclui fontes, imagens, dependências declaradas e lockfile, testes, scripts e documentação. Não inclui credenciais, dependências instaladas, caches, builds ou o arquivo de vídeo.

## Tutoriais de deploy indicados na atividade

Os tutoriais apresentam alternativas de publicação; o enunciado permite explicitamente usar outro provedor além da Vercel. O SeederLink mantém o **GitHub Pages** já utilizado, sem migrar a aplicação para Next.js ou acrescentar uma API Node apenas para reproduzir exemplos que usam outras tecnologias.

| Tutorial | Conteúdo que foi possível conferir | Como foi aplicado ou delimitado |
| --- | --- | --- |
| [React, Vite e Vercel - Hora de Codar](https://youtu.be/e_92Fz99q18) | Transcrição automática completa revisada: projeto funcional, pasta raiz correta, CLI Vercel, build Vite, saída `dist`, logs, endereço publicado e atualização. | Validação do projeto, build e saída `dist` conferidos. A publicação equivalente é feita por GitHub Actions/Pages; não se afirma uso da CLI Vercel. |
| [Deploy API Node - Hero Code](https://youtu.be/8jttLYYDWjo) | Descrição e capítulos públicos: instalar Vercel, configurar build, deploy de teste, conferir resultado e produção. A transcrição não ficou acessível. | Preparação, build e conferência são pertinentes. O exemplo específico de API Node/TypeScript não corresponde ao front-end React estático desta entrega. |
| [Curso Next.js: Deploy na Vercel - Hora de Codar](https://youtu.be/UIg8MAzxtlg) | Metadados e descrição pública sobre publicação do projeto Next.js. A transcrição não ficou acessível. | Contextualiza hospedagem; não exige converter este projeto React/Vite para Next.js. Não são atribuídos ao vídeo passos não verificados. |
| [Hospedar com Vercel e GitHub - Everton Dev](https://youtu.be/e7L_8XVQBik) | Transcrição automática completa revisada: repositório GitHub, raiz correta, seleção do framework Vite, deploy, conferência do endereço e atualização por commit. | Repositório e raiz conferidos; o workflow instala dependências, testa, compila e publica `dist` a cada alteração da `main`. |

**Limite da revisão:** foram lidas as transcrições automáticas dos primeiro e quarto vídeos. Nos outros dois, a conferência se limitou a metadados, descrições e capítulos disponíveis. Isso não equivale a afirmar que todos os quatro vídeos foram assistidos integralmente. Não foram incluídas cópias das transcrições ou das mídias no pacote.

## Publicação reproduzível

1. O `package.json` e o lockfile ficam na raiz do projeto.
2. `npm ci` instala as dependências declaradas.
3. `npm test` valida as regras e os links da entrega.
4. `npm run build` gera `dist`; a base de produção é `/site_seederlink-wolvestech/`.
5. `.github/workflows/deploy-pages.yml` publica somente após o job de build terminar com sucesso.
6. Conferir a Home, o botão do pitch e o diagrama na URL publicada.
7. Gerar novamente PDF e ZIPs pelos scripts descritos no README.
8. Enviar somente o ZIP externo à plataforma FIAP. Não enviar o MP4.

Os resultados dos testes e da conferência do vídeo estão em [VALIDACAO_FASE6.md](VALIDACAO_FASE6.md).
