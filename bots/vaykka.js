const UtteranceGenerator = require("../lib/utterances");
const { postMessage } = require("kosmos-utils");

const token = process.env.KOSMOS_BOT_TOKEN;
const utterances = UtteranceGenerator(require("./vaykka.json"));
const triggers = ["vaykka", "väykkä", "väyry", "paavo", "väykä"];

module.exports = {
    name: "Väykkä",
    onMessage: async data => {
        if (data.type === "message" && data.username !== "Väykkä" && data.text) {
            const text = data.text.toLowerCase();
            if (triggers.some(t => text.indexOf(t) >= 0)) {
                postMessage({
                    channel: data.channel,
                    text: utterances.next(),
                    as_user: false,
                    icon_emoji: ":vaykka:",
                    username: "Väykkä"
                }, token).catch(err => console.error(err));
            }
        }
    }
};
