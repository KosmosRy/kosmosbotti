const RtmListener = require("./lib/rtm");

const bots = [
    require("./bots/puraisin"),
    require("./bots/vaykka")
];

const handleMessage = (data, rtm) => {
    if (data.type) {
        switch (data.type) {
            case "hello":
            case "reconnect_url":
            case "pong":
                break;
            
            default:
                bots.forEach(
                    b => b.onMessage(data, rtm).catch(err => console.error(`Botti ${b.name} feilas: ${err}`))
                )
        }
    }
};

new RtmListener(rtm => {
    bots.forEach(b => {
        console.log(`Initializing bot ${b.name}`);
        b.init && b.init(rtm)
    })
}, handleMessage);