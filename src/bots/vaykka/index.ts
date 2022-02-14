import utteranceGenerator from '../../lib/utterances'
import vaykka from './vaykka.json'
import { App, GenericMessageEvent } from '@slack/bolt'
import { BotRegistration } from '../index'

const utterances = utteranceGenerator(vaykka)

const register: BotRegistration = (app: App) => {
  app.message(
    /vaykka|väykkä|paavo|pave|väyry|väykä/i,
    async ({ say, message }) => {
      const { thread_ts } = message as GenericMessageEvent
      await say({
        text: utterances.next(),
        icon_emoji: ':vaykka:',
        username: 'Väykkä',
        thread_ts
      }).catch(err => console.error(err))
    }
  )
}

export default register
