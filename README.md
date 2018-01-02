Kosmosbotti
===========

Kosmosbotti on yleinen Slack-botti, joka pitää huolen yhteydestä 
Slackiin ja ohjaa sieltä tulevat viestit määritellyille "aliboteille". Kosmosbotti käyttää
Slackin Real Time Messaging API:a (RTM) viestien kuunteluun ja tarjoaa tämän kanavan myös aliboteille, 
jotka kuitenkin voivat halutessaan olla yhteydessä Slackiin muillakin tavoilla. Kosmosbotti välittää 
kaikki vastaanottamansa viestit kaikilta kanavilta, jonne botti on lisätty.

Alibotit
--------

Alibotit voivat olla mitä tahansa javascript-objekteja, joilla on seuraavat ominaisuudet:

```
name: string
init?: (rtm: RtmListener) => void
onMessage: (data: {}, rtm: RtmListener) => Promise<any>
```

Alibotit otetaan käyttöön lisäämällä ylläoleva objekti Kosmosbotin `bots`-taulukkoon:
```javascript
const bots = [
    require("./bots/puraisin")
];
```

Kosmosbotti kutsuu jokaisen määritellyn alibotin init-funktiota (jos se on määritelty) kun 
RTM-yhteys on saatu muodostettua, ja onMessage-funktiota aina kun Slack lähettää viestin.