require("isomorphic-fetch");

const slackApiUrl = "https://slack.com/api";
const token = process.env.KOSMOS_BOT_TOKEN;

const encodeForm = data =>
    Object.entries(data).map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join("&");

const formRequest = (apiMethod, body = {}, requestToken = token) => new Request(`${slackApiUrl}/${apiMethod}`, {
    body: encodeForm({...body, token: requestToken}),
    method: "POST",
    headers: new Headers({
        "Content-type": "application/x-www-form-urlencoded"
    })
});

const jsonRequest = (apiMethod, body = {}, requestToken = token) => new Request(`${slackApiUrl}/${apiMethod}`, {
    body: JSON.stringify(body),
    method: "POST",
    headers: new Headers({
        "Content-type": "application/json",
        "Authorization": `Bearer ${requestToken}`
    })
});

const fetchJson = request =>
    fetch(request).then(res => res.json());

const getUsers = async () => {
    const userList = await fetchJson(formRequest("users.list"));
    return Object.assign({}, ...userList.members.map(u => ({[u.id]: {
            name: u.name,
            realName: u.real_name,
            isBot: u.is_bot
        }})
    ));
};

const getUserInfo = async user =>
    fetchJson(formRequest("users.info", {user}));

const getChannels = async () => {
    const channelList = await fetchJson(formRequest("channels.list"));
    return Object.assign({}, ...channelList.channels.map(c => ({[c.id]: {
            name: c.name
        }})
    ));
};

const postMessage = message => fetchJson(jsonRequest("chat.postMessage", message));

module.exports = {
    encodeForm, formRequest, fetchJson, token, getUsers, getUserInfo, getChannels, postMessage, jsonRequest
};