const RtmListener = require("./rtm");

const bots = [
    require("./bots/puraisin")
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
    bots.forEach(b => b.init && b.init(rtm))
}, handleMessage);