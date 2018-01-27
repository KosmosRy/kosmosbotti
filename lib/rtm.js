const WebSocket = require("ws");
const {fetchJson, formRequest} = require("kosmos-utils");

const token = process.env.KOSMOS_BOT_TOKEN;

const connect = async () =>
    await fetchJson(formRequest("rtm.connect", token, {batch_presence_aware: true}));

let msgCounter = 1;

class RtmListener {
    constructor (onOpen, onMessage) {
        this.ws = null;
        this.onOpen = onOpen;
        this.onMessage = onMessage;
        this.pingRef = null;
        this.reconnect();
    }

    reconnect () {
        const connCatch = reason => {
            console.error("Connection failed: " + reason);
            console.error("Trying again in 10 seconds");
            setTimeout(() => this.connect().catch(connCatch), 10000);
        };

        this.connect().catch(connCatch);
    }

    async connect () {
        if (this.pingRef) {
            clearInterval(this.pingRef);
            this.pingRef = null;
        }
        if (this.ws) {
            this.ws.terminate();
            this.ws = null;
        }

        const res = await connect();
        let pingFailCounter = 6;

        if (res.ok) {
            console.log("Successfully fetched websocket-url from the server");
            const ws = this.ws = new WebSocket(res.url);
            ws.on("open", () => {
                console.log(`Connected to ${res.url}`);
                this.onOpen && this.onOpen(this);
                ws.on("message", data => this.onMessage(JSON.parse(data), this));
                ws.on("error", err => {
                    console.error(err);
                    this.reconnect();
                });
                this.pingRef = setInterval(() => {
                    try {
                        this.ws.send(JSON.stringify({
                            id: msgCounter++,
                            type: "ping"
                        }));
                        pingFailCounter = 6;
                    } catch (err) {
                        console.error(`Couldn't send ping: ${err}`);
                        pingFailCounter--;
                        if (pingFailCounter === 0) {
                            console.error("Ping failed 6 times, trying to reconnect");
                            this.reconnect();
                        }
                    }
                }, 10000);
            });
        } else {
            throw new Error(res.error);
        }
    }

    sendMessage (channel, text) {
        if (this.ws) {
            this.ws.send(JSON.stringify({
                channel, text, id: msgCounter++, type: "message"
            }));
        }
    }
}

module.exports = RtmListener;