# Roteiro do pitch da Fase 5 — até 3 minutos

Este roteiro apresenta somente a nova funcionalidade, como pede a atividade. Antes de gravar, abra o [site publicado](https://dansfisica85.github.io/site_seederlink-wolvestech/), teste as coordenadas escolhidas e feche outras abas com dados pessoais.

## 0:00–0:15 — abertura

> Nesta Fase 5, nós evoluímos o projeto SeederLink em React e acrescentamos uma análise climática no card Fale Conosco. A funcionalidade permite selecionar a localização da propriedade e consultar temperatura, umidade relativa e radiação solar.

## 0:15–0:45 — como o React foi aplicado

> O mapa está no componente MapaClimatico, que é renderizado dentro do componente Contato. Eu usei estados do React para guardar a coordenada, o carregamento, os erros e o resultado. Também usei efeitos para criar e desmontar o mapa Leaflet, movimentar o marcador e consultar os serviços climáticos quando o local muda.

Mostre rapidamente os arquivos `src/components/Contato.jsx`, `src/components/MapaClimatico.jsx` e `src/lib/climate.js`. Não gaste tempo apresentando partes antigas do site.

## 0:45–1:20 — seleção do local

> O usuário pode clicar no mapa, arrastar o marcador, usar a localização do navegador ou digitar latitude e longitude. Cada escolha entra no mesmo fluxo de validação. O mapa usa Leaflet e a cartografia do OpenStreetMap.

Faça uma seleção e mostre o marcador. Se usar o botão de localização, não revele um endereço pessoal na gravação.

## 1:20–1:55 — dados atuais e históricos

> Depois da seleção, o sistema consulta a Open-Meteo. Ele mostra as condições atuais e calcula médias com 365 dias históricos, exigindo pelo menos 350 dias completos. Se o histórico principal falhar, a NASA POWER funciona como fonte alternativa.

Mostre temperatura, umidade e radiação nos dois grupos. Explique que os dados são modelados, e não sensores instalados na propriedade.

## 1:55–2:30 — cruzamento e mensagens

> A função de triagem cruza três condições ao mesmo tempo: temperatura média entre 20 e 27 graus, umidade média entre 60 e 80 por cento e radiação média de pelo menos 8,5 megajoules por metro quadrado por dia. Quando as três passam, aparece a mensagem de pré-análise positiva. Quando qualquer uma falha, o sistema informa que será necessária uma conversa complementar.

Mostre uma consulta com o resultado disponível. Se for demonstrar os dois resultados, valide as coordenadas imediatamente antes de gravar, porque o histórico muda com o tempo.

## 2:30–2:50 — confiabilidade e limites

> Para evitar resultados antigos, uma nova escolha cancela a consulta anterior. O sistema também trata erros, usa cache por 30 minutos e não libera pré-aprovação quando precisou usar a fonte histórica alternativa. Esta é uma triagem acadêmica e não substitui análise agronômica, ZARC ou análise financeira.

## 2:50–3:00 — encerramento

> Essa foi a nova funcionalidade da Fase 5 do SeederLink: React conectando geolocalização, APIs climáticas e uma regra de triagem transparente. Obrigado.

## Depois de publicar o vídeo

1. Publique o vídeo como público ou não listado, mas acessível sem pedir login ou permissão.
2. Substitua o link antigo em `src/components/Hero.jsx`.
3. Abra a Home publicada e teste o novo link em uma janela anônima.
4. Preencha `ENTREGA_FIAP_FASE_5.txt` com o novo endereço e os integrantes.
5. Gere o PDF pedido pela FIAP com nomes, link do pitch e link do deploy.
6. Teste os links dentro do PDF.
7. Coloque o projeto e o PDF no ZIP, mas não inclua o arquivo do vídeo.
