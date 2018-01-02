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

const getChannels = async () => {
    const channelList = await fetchJson(formRequest("channels.list"));
    return Object.assign({}, ...channelList.channels.map(c => ({[c.id]: {
            name: c.name
        }})
    ));
};

module.exports = {
    encodeForm, formRequest, fetchJson, token, getUsers, getChannels
};