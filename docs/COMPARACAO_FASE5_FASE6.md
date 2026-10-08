# Comparação — SeederLink da Fase 5 para a Fase 6

## Referência utilizada

A referência é o projeto entregue no arquivo `01_Projeto_SeederLink_Fase5.zip` anexado a esta atividade. Essa base já utiliza React em toda a interface ativa: `index.html` inicia `src/main.jsx`, que monta `App.jsx` e seus componentes. Portanto, a Fase 6 dá continuidade à aplicação React existente.

Na Fase 5, a nova funcionalidade era escolher a posição da propriedade no mapa e consultar uma análise climática. Na Fase 6, a nova funcionalidade é a **Carteira de Propriedades**, que organiza, conserva e compara essas consultas.

## O que mudou

| Aspecto | Base anexada da Fase 5 | Evolução da Fase 6 |
| --- | --- | --- |
| Interface | Componentes funcionais React, estados e efeitos. | React também controla o cadastro, a lista, a seleção, o histórico e a comparação da carteira. |
| Mapa | Leaflet com OpenStreetMap; seleção por clique, arraste, geolocalização ou coordenadas. | O resultado concluído pode ser copiado explicitamente para a carteira. |
| Resultado climático | Exibido no mapa; a seleção seguinte substitui o resultado em tela. | Uma fotografia da análise pode ser vinculada a uma propriedade e preservada no histórico. |
| Cadastro de propriedade | Não existia um cadastro persistente de propriedades. | Nome, cultura e área em hectares identificam cada propriedade cadastrada. |
| Persistência | O cache climático existia somente em memória, por até 30 minutos, com limite de 20 locais. | A carteira usa `localStorage` para recuperar registros após atualizar ou reabrir o site no mesmo navegador e origem. O cache climático continua tendo outra finalidade. |
| Capacidade | Sem carteira de propriedades. | Até 10 propriedades, com até 5 análises por propriedade. |
| Comparação | Uma consulta por vez no mapa. | Comparação entre 2 propriedades distintas, lado a lado. |
| Exportação | Não havia exportação da carteira. | Download dos registros em JSON. |
| Modelagem | Componentes funcionais e funções de clima; apenas `ClimateDataError` era uma classe explícita. | Cinco classes de domínio e persistência correspondem ao diagrama UML da nova funcionalidade. |
| Pitch | Vídeo anterior apresentava o mapa e a análise climática. | O novo roteiro apresenta a carteira e explica atributos, métodos e relacionamentos UML. O novo link público ainda precisa ser fornecido. |

## Fluxo da nova funcionalidade

1. O usuário escolhe a coordenada no mapa e aguarda uma consulta concluída.
2. Um botão copia explicitamente aquela análise para o cadastro da carteira.
3. O registro preparado mantém as coordenadas, a data, o período e a fonte identificados. Uma nova seleção no mapa não modifica silenciosamente essa cópia.
4. O usuário informa nome, cultura e área e salva a propriedade, ou acrescenta uma nova análise a uma propriedade cadastrada.
5. A carteira mantém até 10 propriedades e até 5 análises por propriedade.
6. O usuário seleciona 2 propriedades distintas para visualizar a comparação.
7. Os registros podem ser recuperados no mesmo navegador e exportados em JSON.

## Como as classes organizam a solução

Os nomes abaixo correspondem às classes implementadas para a nova funcionalidade. Os métodos específicos estão no código e são representados no diagrama da entrega; esta tabela explica suas responsabilidades em linguagem simples.

| Classe | Informações principais | Comportamentos e responsabilidade |
| --- | --- | --- |
| `Localizacao` | Latitude e longitude. | Validar e representar a posição da propriedade. |
| `AnaliseClimatica` | Médias, período, fonte, data e avaliação da consulta. | Guardar e representar uma fotografia climática consistente. |
| `PropriedadeRural` | Identificador, nome, cultura, área, localização e análises. | Representar uma propriedade e acrescentar análises ao seu histórico limitado. |
| `CarteiraPropriedades` | Conjunto de propriedades. | Organizar os registros, controlar a capacidade e comparar duas propriedades. |
| `RepositorioLocal` | Identificação do armazenamento da carteira. | Gravar e recuperar os registros usando o armazenamento local do navegador. |

A carteira reúne até dez propriedades por **agregação** (losango vazio): uma propriedade pode ser construída como entidade antes de ser adicionada. Cada propriedade possui uma localização e até cinco análises por **composição** (losango preenchido), pois essas partes constituem seu registro. O repositório tem uma **dependência** da carteira (seta tracejada) para armazenar e recuperar seus dados. Não foi necessário inventar uma relação de herança para atender ao diagrama.

As classes organizam dados e comportamentos da carteira. Os componentes React continuam sendo funções responsáveis pela apresentação e interação; não são apresentados como subclasses dessas entidades.

## O que foi mantido da Fase 5

- A estrutura principal do site e a seção Fale Conosco.
- O formulário de contato com validação e confirmação visual.
- O mapa com Leaflet e a cartografia OpenStreetMap.
- A Open-Meteo para as condições atuais e o histórico principal.
- A NASA POWER como fonte histórica alternativa.
- A janela de 365 dias, com atraso de 7 dias e exigência de pelo menos 350 dias completos.
- As três faixas demonstrativas: temperatura média de 20 a 27 °C, umidade média de 60% a 80% e radiação média de pelo menos 8,5 MJ/m²/dia.
- A exigência de que as três condições passem ao mesmo tempo para uma triagem positiva com a fonte principal.
- A análise complementar obrigatória quando a NASA POWER é usada.
- A identificação das fontes e as mensagens de erro, carregamento e resultado.

## Limites que fazem parte da demonstração

**Armazenamento local.** Os registros pertencem ao navegador e à origem do site. Não há conta de usuário, sincronização entre aparelhos nem banco de dados remoto para esta carteira. Limpar os dados do navegador pode remover os registros; a exportação JSON permite guardar uma cópia. Exportar não significa que exista importação automática.

**Cultura e área.** Esses campos descrevem a propriedade e ajudam a organizar a comparação. Eles não recalculam as faixas climáticas, não estimam produtividade e não alteram a triagem de crédito. A área é informada pelo usuário; o mapa seleciona um ponto e não mede o terreno.

**Histórico de consultas.** As até cinco análises guardadas por propriedade são fotografias de consultas. Não representam cinco anos de observações, monitoramento contínuo nem um sensor instalado no local. Cada fotografia conserva seu próprio período e sua fonte.

**Comparação.** Comparar indicadores lado a lado não comprova qual propriedade é melhor para uma cultura. Fontes, datas e períodos diferentes devem ser considerados. Uma temperatura maior ou umidade maior não é automaticamente um resultado melhor.

**Fonte alternativa.** Quando os indicadores vêm da NASA POWER, a análise permanece em revisão mesmo que as três médias estejam nas faixas. Salvar, reabrir ou comparar a propriedade não deve transformar esse resultado em pré-aprovação.

**Contato e crédito.** O formulário herdado continua sendo uma demonstração visual: não envia mensagem a um servidor. A triagem climática é acadêmica e não concede crédito real nem substitui uma avaliação técnica ou financeira.

## Entrega da Fase 6

O pacote deve reunir um PDF com nomes completos dos integrantes, imagem do diagrama de classes, link público do novo vídeo e link do deploy, além de um ZIP contendo o projeto. O arquivo de vídeo não deve ser incluído.

O roteiro está em [ROTEIRO_PITCH_FASE_6.md](ROTEIRO_PITCH_FASE_6.md). A publicação do vídeo da Fase 6 e a inclusão de seu link definitivo na Home e no PDF dependem do novo endereço público. O vídeo anterior não deve ser identificado como se já demonstrasse a carteira.
