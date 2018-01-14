const { getUsers, getChannels } = require("../lib/utils");
const { Pool } = require("pg");
const puraisuRE = /^(.*?);(.*?);([^;]*)(?:;(.+))?/;

const mode = process.env.PURAISIN_MODE || "prod";

const name = "Puraisin";
const channelName = mode === "prod" ? "puraisut" : "hiekkalaatikko";
const pool = new Pool({connectionString: process.env.PG_PURAISIN_URL});

let userMap = {};
let channelId;

let initPromise;
const init = () => {
    initPromise = Promise.all([
        getUsers().then(res => userMap = res),
        getChannels().then(res => Object.entries(res)
            .filter(([id, o]) => o.name === channelName)
            .forEach(([id]) => channelId = id))
    ]).then(() => console.log(`Initializing ${name} done`));
};

const insertPuraisu = async (user, type, content, location, info) => {
    console.log("Inserting puraisu");
    await pool.query(
        "INSERT INTO puraisu (type, content, location, info, source, biter) VALUES($1, $2, $3, $4, $5, $6)",
        [type, content, location, info, "slack", user]
    );
};

const onMessage = async (data) => {
    await initPromise;
    if (data.type === "message" && data.channel === channelId) {
        if (!data.user) {
            console.log("Ei käyttäjätietoa");
            console.log(data);
            return;
        }
        let userName = userMap[data.user] != null ? userMap[data.user].name : null;
        if (!userName) {
            await getUsers().then(res => userMap = res);
            if (!userMap[data.user]) {
                throw new Error(`Unknown user: ${data.user}`);
            }
            userName = userMap[data.user].name;
        }
        data.text.split(/\n/)
            .filter(l => !l.startsWith("--") && !l.startsWith("—")) // ios-kommenttimerkki, vittu, Steve!!
            .filter(l => {
                const include = !l.startsWith("\u{200B}");  // puraisu logattu jo pikapuraisimessa
                if (!include) {
                    console.log("Pikapuraisinrapsa, ei tallenneta");
                }
                return include;
            })
            .map(l => l.match(puraisuRE))
            .filter(l => l)
            .forEach(([_, _1, _2, _3, _4]) => {
                const type = _1.trim().substr(0, 12);
                const content = _2.trim().substr(0, 64);
                const location = _3.trim().substr(0, 64);
                const info = _4 ? _4.trim() : null;
                if (mode === "prod") {
                    insertPuraisu(userName, type, content, location, info).catch(err => console.error(err));
                } else {
                    console.log(`Puraisu - ${userName}: ${type} ${content} ${location} ${info}`);
                }
            })
    }
};

module.exports = {
    name,
    init,
    onMessage
};