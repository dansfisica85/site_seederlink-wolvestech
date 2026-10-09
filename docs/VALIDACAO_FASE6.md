# Validação da Fase 6

## Código e produção local

- `npm test`: **25 testes passaram**, sem falhas, na finalização de 08/10/2026. Incluem duas verificações dos links da entrega.
- `npm run build`: compilação concluída com a base `/site_seederlink-wolvestech/` usada no GitHub Pages.
- `npm run test:ui`: fluxo verificado no Chrome na revisão funcional anterior, sem erros JavaScript. O script também passou a verificar o pitch da Fase 6 na Home.
- Larguras verificadas: 360, 768 e 1440 px, aguardando a reorganização do layout/mapa após redimensionamento.

O teste de interface usa respostas climáticas controladas para ser repetível. Foram exercitados: cadastro de duas propriedades, persistência após recarga, comparação, inclusão no histórico, fonte NASA POWER com revisão obrigatória, exportação JSON, cancelamento/confirmacão de remoção, falha de cota e JSON corrompido. Falhas não produziram sucesso falso nem apagaram os registros anteriores.

## Consulta real às APIs

Além dos testes controlados, foi executada uma consulta real em latitude **-21.1775**, longitude **-47.8103**, por meio da própria função `fetchClimateForLocation`. O retorno foi:

- Fonte histórica: Open-Meteo.
- Período: 02/10/2025 a 01/10/2026.
- Dias válidos: 363.
- Temperatura média: aproximadamente 23,37 °C.
- Umidade média: aproximadamente 67,80%.
- Radiação média: aproximadamente 18,62 MJ/m²/dia.
- Os três critérios demonstrativos foram atendidos nessa consulta.

Esses números são evidência daquela execução e não promessa de valores futuros. A disponibilidade depende dos provedores e da conexão do usuário. Uma triagem positiva não é concessão real de crédito.

## Documentos e entrega

O PDF foi gerado com três páginas e conferido por renderização: integrantes/links, imagem UML e explicação das classes. O diagrama foi modelado em Mermaid e corresponde a `src/domain/portfolio.js`.

O pacote externo contém somente o PDF e o ZIP do projeto; a compactação verifica integridade e exclui dependências, builds, vídeos, arquivos de ambiente e caches. O script de geração não inventa um link de vídeo.

## Fechamento do pitch em 08/10/2026

- Link definitivo: https://youtu.be/BJ_unP9lmys, também configurado em `src/data/entrega.js`, README e resumo da entrega.
- Título no YouTube: **PICH DA FASE 6 - FIAP**, canal **profdavi85**.
- Duração informada pelo player: **175 segundos (2min55s)**; o Studio arredonda a exibição para 2min56s. Ambos ficam abaixo de três minutos.
- Com autorização do responsável, a visibilidade foi alterada de **Não listado** para **Público**. O Studio confirmou que todas as alterações foram salvas.
- Uma nova consulta sem autenticação confirmou `playabilityStatus: OK`, `isPrivate: false` e `isUnlisted: false`.
- PDF regenerado: três páginas, os quatro integrantes/RMs atuais, imagem UML na página 2 em paisagem e links clicáveis do deploy e do pitch. Sem aviso de pitch pendente.
- As referências da Fase 5 foram preservadas e identificadas como históricas.

O [checklist de entrega](CHECKLIST_ENTREGA_FASE6.md) relaciona os requisitos aos arquivos e registra o alcance da revisão dos tutoriais. A postagem na plataforma FIAP cabe ao aluno.
