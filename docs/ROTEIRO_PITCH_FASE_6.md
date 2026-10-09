# Roteiro do pitch — SeederLink, Fase 6

Vídeo da entrega: [Pitch da Fase 6](https://youtu.be/BJ_unP9lmys), com **2min55s**. A sequência abaixo preserva o roteiro-base de 2min50s; a edição publicada continua dentro do limite de três minutos.

Duração-alvo: **2 minutos e 50 segundos**. Texto de locução: **341 palavras**, em primeira pessoa, por Davi em nome do grupo. A tabela abaixo usa os mesmos trechos do texto contínuo e fixa os pontos de transição. Ensaiar cada bloco para respeitar a sincronização, com pausas curtas nas trocas de tela.

## Texto contínuo para locução

Olá, eu sou o Davi e, em nome do nosso grupo, apresento a Fase 6 do SeederLink: a Carteira de Propriedades.

No mapa, escolho as coordenadas e confiro o resultado climático. A consulta reúne condições atuais, médias históricas, período e fonte. Ao clicar em salvar esta análise na carteira, preparo uma cópia daquele momento; mover o mapa depois não altera o registro.

Na carteira, informo o nome, escolho a cultura e preencho a área em hectares. Salvo a propriedade e confiro o cartão criado. O limite é de dez propriedades, com até cinco análises recentes por propriedade. Cultura e área identificam o cadastro, sem mudar a regra climática.

Seleciono duas propriedades e abro a comparação. Vejo os indicadores lado a lado. O sistema verifica se fontes e períodos são compatíveis e informa diferenças. Essa comparação não decide concessão de crédito.

Recarrego a página: os registros continuam aqui. Também abro o histórico para conferir as consultas salvas nesta propriedade.

Agora mostro o diagrama UML em paisagem. Os atributos representam os dados, e os métodos, as ações das cinco classes implementadas no código. As assinaturas foram resumidas no desenho para facilitar a leitura.

CarteiraPropriedades mantém a coleção e oferece adicionar, remover, buscar e comparar. PropriedadeRural reúne identificação, nome, cultura, área, localização e análises; adicionarAnalise registra uma consulta, e resumo retorna a mais recente.

Localizacao guarda latitude e longitude. AnaliseClimatica preserva coordenadas, data, fuso, condições atuais, histórico, período e avaliação; o método estático fromClimateResult cria essa análise. RepositorioLocal recebe o armazenamento e sua chave; carregar e salvar recuperam e persistem a carteira.

A agregação indica que a carteira reúne propriedades. A composição representa uma localização e até cinco análises por propriedade. A dependência tracejada mostra o repositório usando a carteira. Não há herança entre essas classes.

Volto à carteira e exporto o JSON para guardar uma cópia. Os dados ficam no localStorage deste navegador, sem sincronização entre dispositivos. Quando a fonte alternativa NASA POWER aparece, preservamos a indicação de revisão.

Assim, organizamos consultas com histórico, comparação e um modelo de classes claro. Muito obrigado!

## Narração sincronizada com a gravação

| Tempo | O que mostrar | Narração |
| --- | --- | --- |
| 00:00–00:12 | Home e entrada na Carteira de Propriedades. | Olá, eu sou o Davi e, em nome do nosso grupo, apresento a Fase 6 do SeederLink: a Carteira de Propriedades. |
| 00:12–00:34 | Mapa, coordenadas, resultado concluído e envio da análise para a carteira. | No mapa, escolho as coordenadas e confiro o resultado climático. A consulta reúne condições atuais, médias históricas, período e fonte. Ao clicar em salvar esta análise na carteira, preparo uma cópia daquele momento; mover o mapa depois não altera o registro. |
| 00:34–00:58 | Preencher nome, cultura e área; salvar e conferir o cartão. | Na carteira, informo o nome, escolho a cultura e preencho a área em hectares. Salvo a propriedade e confiro o cartão criado. O limite é de dez propriedades, com até cinco análises recentes por propriedade. Cultura e área identificam o cadastro, sem mudar a regra climática. |
| 00:58–01:16 | Selecionar duas propriedades e abrir a comparação. | Seleciono duas propriedades e abro a comparação. Vejo os indicadores lado a lado. O sistema verifica se fontes e períodos são compatíveis e informa diferenças. Essa comparação não decide concessão de crédito. |
| 01:16–01:26 | Recarregar a página; abrir o histórico de uma propriedade. | Recarrego a página: os registros continuam aqui. Também abro o histórico para conferir as consultas salvas nesta propriedade. |
| 01:26–02:25 | Mostrar o UML em paisagem em tela cheia. Apontar cada classe pelo nome e depois os relacionamentos, sem encobrir textos ou multiplicidades. | Agora mostro o diagrama UML em paisagem. Os atributos representam os dados, e os métodos, as ações das cinco classes implementadas no código. As assinaturas foram resumidas no desenho para facilitar a leitura. CarteiraPropriedades mantém a coleção e oferece adicionar, remover, buscar e comparar. PropriedadeRural reúne identificação, nome, cultura, área, localização e análises; adicionarAnalise registra uma consulta, e resumo retorna a mais recente. Localizacao guarda latitude e longitude. AnaliseClimatica preserva coordenadas, data, fuso, condições atuais, histórico, período e avaliação; o método estático fromClimateResult cria essa análise. RepositorioLocal recebe o armazenamento e sua chave; carregar e salvar recuperam e persistem a carteira. A agregação indica que a carteira reúne propriedades. A composição representa uma localização e até cinco análises por propriedade. A dependência tracejada mostra o repositório usando a carteira. Não há herança entre essas classes. |
| 02:25–02:44 | Voltar à carteira e exportar o JSON. Manter a informação de fonte/revisão visível quando aplicável. | Volto à carteira e exporto o JSON para guardar uma cópia. Os dados ficam no localStorage deste navegador, sem sincronização entre dispositivos. Quando a fonte alternativa NASA POWER aparece, preservamos a indicação de revisão. |
| 02:44–02:50 | Concluir com a carteira na tela. | Assim, organizamos consultas com histórico, comparação e um modelo de classes claro. Muito obrigado! |

## Orientações para gravação e leitura do UML

- Mostrar a aplicação funcionando, com a consulta climática concluída antes do início da tomada. Usar cadastros de demonstração, sem dados pessoais, e preparar uma segunda propriedade para a comparação.
- No bloco de cadastro, executar o salvamento de verdade. No bloco de persistência, recarregar e conferir os mesmos registros; abrir o histórico sem simular consultas adicionais.
- Dedicar **01:26–02:25** ao UML em paisagem. Manter o diagrama inteiro legível e apontar as classes pelo nome: CarteiraPropriedades, PropriedadeRural, Localizacao, AnaliseClimatica e RepositorioLocal. A locução não depende da posição definitiva das caixas.
- As classes do diagrama correspondem às implementadas em `src/domain/portfolio.js`. A assinatura resumida `fromClimateResult()` representa o método estático `fromClimateResult(result, consultedAt)`; os parâmetros foram omitidos apenas para melhorar a leitura. Os construtores e detalhes auxiliares não precisam entrar na locução.
- Nos relacionamentos, destacar o losango vazio da **agregação** da carteira com **0..10 propriedades**, os losangos preenchidos da **composição** da propriedade com **1 localização** e **0..5 análises**, e a seta tracejada da **dependência** do repositório em relação à carteira. São relacionamentos do modelo apresentado, sem herança artificial.
- Se necessário na explicação oral, esclarecer que `buscar(id)` e `resumo()` podem retornar `null` quando não há resultado; acrescentar uma análise cria uma nova versão da propriedade, preservando o registro anterior.
- Em **02:25**, retornar à carteira e executar a exportação JSON. O armazenamento é local ao navegador e ao endereço do site; apagar os dados do navegador pode remover a carteira. Não afirmar sincronização, decisão de crédito ou adequação automática quando houver aviso de revisão.
- Encerrar em **02:50**. Conferir o arquivo final, a legibilidade do UML e a sincronização da locução antes da entrega. Este roteiro não comprova publicação de vídeo.
