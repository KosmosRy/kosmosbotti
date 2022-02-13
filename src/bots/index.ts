import vaykka from './vaykka'
import { App } from '@slack/bolt'

export type BotRegistration = (app: App) => void

const bots: BotRegistration[] = [vaykka]

export default bots
