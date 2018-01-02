const { getUsers, getChannels } = require("../utils");
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
    console.log("Initializing puraisin...");
    initPromise = Promise.all([
        getUsers().then(res => userMap = res),
        getChannels().then(res => Object.entries(res)
            .filter(([id, o]) => o.name === channelName)
            .forEach(([id]) => channelId = id))
    ]).then(() => console.log("Initializing puraisin done"));
};

const insertPuraisu = async (user, type, content, location, info) => {
    console.log("Inserting puraisu");
    await pool.query(
        "INSERT INTO puraisu (type, content, location, source, biter) VALUES($1, $2, $3, $4, $5)",
        [type, content, location, info, user]
    );
};

const onMessage = async (data) => {
    await initPromise;
    let userName = userMap[data.user].name;
    if (!userName) {
        await getUsers().then(res => userMap = res);
        userName = userMap[data.user].name;
        if (!userName) {
            throw new Error(`Unknown user: ${data.user}`);
        }
    }
    if (data.type === "message" && data.channel === channelId) {
        data.text.split(/\n/)
            .filter(l => !l.startsWith("--") && !l.startsWith("—")) // ios-kommenttimerkki, vittu, Steve!!
            .map(l => l.match(puraisuRE))
            .filter(l => l)
            .forEach(([_, _1, _2, _3, _4]) => {
                const type = _1.trim();
                const content = _2.trim();
                const location = _3.trim();
                const info = _4 ? _4.trim() : "";
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