import utteranceGenerator from '../../lib/utterances'
import vaykka from './vaykka.json'
import { App } from '@slack/bolt'
import { BotRegistration } from '../index'

const utterances = utteranceGenerator(vaykka)

const register: BotRegistration = (app: App) => {
  app.message(/vaykka|väykkä|paavo|väyry|väykä/, async ({ say }) => {
    await say({
      text: utterances.next(),
      icon_emoji: ':vaykka:',
      username: 'Väykkä'
    }).catch(err => console.error(err))
  })
}

export default register
