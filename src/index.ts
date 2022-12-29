import 'dotenv/config'
import 'log-timestamp'
import bolt from '@slack/bolt'
import type { AppOptions } from '@slack/bolt'
import bots from './bots'

const { App } = bolt

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

const joinChannel = ([channelId, name]: string[]) => {
  console.log(`Joining channel #${name}`)
  return app.client.conversations.join({
    ...cliOpt,
    channel: channelId
  })
}

bots.forEach(bot => bot(app))

if (autoJoin) {
  app.event('channel_created', async ({ event }) => {
    await joinChannel([event.channel.id, event.channel.name])
  })
}
;(async () => {
  await app.start(PORT ?? 3000)

  console.log('⚡️ Bolt app is running!')

  if (autoJoin) {
    const channels = await app.client.users
      .conversations(cliOpt)
      .then(({ channels = [] }) =>
        channels.map(({ id = '' }) => id).filter(id => !!id)
      )

    const allChannels = await app.client.conversations
      .list(cliOpt)
      .then(({ channels = [] }) =>
        channels
          .filter(({ id, is_archived }) => !is_archived && !!id)
          .map(({ id = '', name = 'noname' }) => [id, name])
      )

    const joins = allChannels
      .filter(([id]) => !channels.includes(id))
      .map(joinChannel)

    await Promise.allSettled(joins)
  }
})()
