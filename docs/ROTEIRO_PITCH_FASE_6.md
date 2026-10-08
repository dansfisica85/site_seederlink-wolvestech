# Roteiro do pitch — SeederLink, Fase 6

Este roteiro apresenta a nova Carteira de Propriedades e explica as cinco classes do projeto. A leitura foi planejada para aproximadamente 2 minutos e 45 segundos, deixando uma pequena margem até o limite de 3 minutos. Faça um ensaio cronometrado antes de publicar.

**Situação do vídeo:** o link de um novo pitch da Fase 6 ainda não foi fornecido. O vídeo da Fase 5 é uma referência anterior e não substitui esta gravação.

## Texto para ler

Olá, eu sou o Davi, e vou apresentar a evolução do SeederLink na Fase 6: a Carteira de Propriedades. Mantivemos a construção do site em React e acrescentamos uma forma de guardar e comparar as análises climáticas consultadas no mapa.

Primeiro, seleciono a localização da propriedade. Depois que a consulta termina, envio essa análise para a carteira. Essa ação copia os dados daquele momento, com coordenadas, período e fonte, para que eu saiba exatamente o que estou cadastrando.

Agora, informo o nome da propriedade, a cultura e a área em hectares. Ao salvar, o React atualiza a lista na tela. A carteira permite até dez propriedades e mantém até cinco análises por propriedade, formando um pequeno histórico de consultas.

Aqui, seleciono duas propriedades para comparar. Consigo visualizar suas características e os indicadores climáticos lado a lado. Também posso exportar os registros em JSON, um formato de dados que facilita guardar uma cópia. Os registros permanecem neste navegador após atualizar a página, porque usamos o armazenamento local, chamado localStorage.

Para organizar essa funcionalidade, criamos cinco classes, representadas neste diagrama UML. Localizacao guarda latitude e longitude e valida as coordenadas. AnaliseClimatica reúne as médias, o período, a fonte e o resultado da consulta. PropriedadeRural guarda nome, cultura, área, localização e histórico, além de permitir acrescentar análises.

CarteiraPropriedades organiza o conjunto, controla os limites e permite comparar duas propriedades. RepositorioLocal cuida de gravar e recuperar os registros no navegador. No diagrama, os atributos mostram o que cada objeto guarda e os métodos mostram suas ações.

A agregação mostra que a carteira reúne propriedades. A composição mostra que cada propriedade possui sua localização e suas análises. A seta tracejada indica que o repositório depende da carteira para persistir os dados. Não precisamos criar uma herança artificial.

Por fim, cultura e área identificam o cadastro, mas não alteram a regra climática. Quando a fonte alternativa NASA POWER é utilizada, o resultado continua exigindo revisão. O armazenamento não sincroniza entre dispositivos. Assim, a nova função permite organizar e comparar consultas com rastreabilidade e uma estrutura de classes clara. Muito obrigado!

## O que mostrar na tela

Os tempos abaixo são metas de edição; ajuste as transições à sua leitura real.

| Tempo aproximado | Mostrar |
| --- | --- |
| 00:00–00:20 | Home e entrada na Carteira de Propriedades. |
| 00:20–00:40 | Mapa com análise concluída; botão que copia a análise para a carteira; coordenadas e fonte do registro preparado. |
| 00:40–01:00 | Preenchimento de nome, cultura e área; salvamento; lista e histórico. |
| 01:00–01:25 | Seleção de duas propriedades, comparação, exportação JSON e atualização da página. |
| 01:25–02:25 | Diagrama UML legível; apontar as cinco classes, atributos, métodos e relacionamentos enquanto são citados. |
| 02:25–02:50 | Voltar à carteira, mostrar a identificação da fonte e concluir a apresentação. |

Para evitar gastar tempo esperando APIs durante a gravação, deixe duas propriedades cadastradas previamente e uma consulta concluída no mapa. Mostre o salvamento de uma análise e a comparação desses registros. Se a fonte for NASA POWER, preserve o aviso de revisão na demonstração.

## Conferência antes da entrega

1. Gravar a nova funcionalidade e a explicação do diagrama com duração total de até 3 minutos.
2. Publicar o novo vídeo com visibilidade **pública** em uma plataforma de compartilhamento.
3. Colocar o link público da Fase 6 na Home e no PDF de entrega.
4. Conferir o vídeo, o deploy e os links em uma janela sem autenticação.
5. Incluir o PDF e o ZIP do projeto no pacote final. Não incluir o arquivo de vídeo.
