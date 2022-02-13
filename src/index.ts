import { App, AppOptions } from '@slack/bolt'
import bots from './bots'

const config: AppOptions = {
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
}

const cliOpt = { token: config.token }

const app = new App(config)

const joinChannel = (channelId: string) => {
  console.log('Joining channel', channelId)
  return app.client.conversations.join({
    ...cliOpt,
    channel: channelId
  })
}

bots.forEach(bot => bot(app))

app.event('channel_created', async ({ event }) => {
  await joinChannel(event.channel.id)
})
;(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000)

  console.log('⚡️ Bolt app is running!')

  const channels = await app.client.users
    .conversations(cliOpt)
    .then(({ channels }) => channels?.map(({ id }) => id ?? '') ?? [])

  const allChannels = await app.client.conversations
    .list(cliOpt)
    .then(({ channels }) => channels?.map(({ id }) => id ?? '') ?? [])

  const joins = allChannels.filter(c => !channels.includes(c)).map(joinChannel)

  await Promise.allSettled(joins)
})()
