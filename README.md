[![Fuck Putin](https://img.shields.io/badge/fuck-putin-black.svg)](https://twitter.com/Tyrrrz/status/1495972130789502980?s=20&t=3dCM7iZbUJi-K0rDa4-JiQ)

Kosmosbotti
===========

Kosmosbotti on yleinen Slack-botti, joka pitää huolen yhteydestä 
Slackiin ja ohjaa sieltä tulevat viestit määritellyille "aliboteille". Kosmosbotti on 
rakennettu Slackin [Bolt SDK:n](https://api.slack.com/tools/bolt) avulla.

Alibotit
--------

Alibotit voivat olla mitä tahansa javascript-funktioita, jotka toteuttavat 
[BotRegistration](./src/bots/index.ts) rajapinnan. Alibotti otetaan käyttöön lisäämällä 
ylläoleva funktio [bots](./src/bots/index.ts)-taulukkoon.

Kosmosbotti kutsuu jokaista bot-funktiota jolloin botti voi liittää toiminnallisuutensa Boltin
`App`-instanssiin.
