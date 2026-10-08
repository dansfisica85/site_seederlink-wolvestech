# Validação da Fase 6

## Código e produção local

- `npm test`: **23 testes passaram**, sem falhas.
- `npm run build`: compilação concluída com a base `/site_seederlink-wolvestech/` usada no GitHub Pages.
- `npm run test:ui`: fluxo verificado no Chrome, sem erros JavaScript.
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

**Pendência para postagem final:** publicar o novo pitch da Fase 6, inserir sua URL pública na Home e no PDF e regenerar o pacote. O vídeo antigo é identificado como Fase 5. O roteiro está pronto, mas não é uma gravação publicada.
