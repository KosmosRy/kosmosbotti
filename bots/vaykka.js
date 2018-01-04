const UtteranceGenerator = require("../lib/utterances");
const { postMessage } = require("../lib/utils");

const utterances = UtteranceGenerator(require("./vaykka.json"));
const triggers = ["vaykka", "väykkä", "väyry", "paavo", "väykä"];

module.exports = {
    name: "Väykkä",
    onMessage: async data => {
        if (data.type === "message" && data.username !== "Väykkä") {
            const text = data.text.toLowerCase();
            if (triggers.some(t => text.indexOf(t) >= 0)) {
                postMessage({
                    channel: data.channel,
                    text: utterances.next(),
                    as_user: false,
                    icon_emoji: ":vaykka:",
                    username: "Väykkä"
                }).catch(err => console.error(err));
            }
        }
    }
};
