import 'dotenv/config'
import 'log-timestamp'
import { App, AppOptions } from '@slack/bolt'
import bots from './bots'

const {
  SLACK_BOT_TOKEN: token,
  SLACK_SIGNING_SECRET: signingSecret,
  SLACK_APP_TOKEN: appToken,
  SLACK_SOCKET_MODE,
  SLACK_AUTO_JOIN,
  PORT
} = process.env

const config: AppOptions = {
  token,
  signingSecret,
  appToken,
  socketMode: SLACK_SOCKET_MODE === 'true'
}

const autoJoin = SLACK_AUTO_JOIN === 'true'

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

if (autoJoin) {
  app.event('channel_created', async ({ event }) => {
    await joinChannel(event.channel.id)
  })
}
;(async () => {
  await app.start(PORT ?? 3000)

  console.log('⚡️ Bolt app is running!')

  if (autoJoin) {
    const channels = await app.client.users
      .conversations(cliOpt)
      .then(({ channels }) => channels?.map(({ id }) => id ?? '') ?? [])

    const allChannels = await app.client.conversations
      .list(cliOpt)
      .then(({ channels }) => channels?.map(({ id }) => id ?? '') ?? [])

    const joins = allChannels
      .filter(c => !channels.includes(c))
      .map(joinChannel)

    await Promise.allSettled(joins)
  }
})()
