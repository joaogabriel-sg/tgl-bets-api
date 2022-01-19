import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import { BaseTask } from 'adonis5-scheduler/build'
import Bet from 'App/Models/Bet'
import User from 'App/Models/User'
import { subWeeks, isAfter } from 'date-fns'

type UserWhoNotBetInAWeek = {
  name: string
  email: string
}

export default class EmailToPlayersRemindingThemToBet extends BaseTask {
  public static get schedule() {
    return '0 0 9 * * *'
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    const users = await User.all()
    const now = new Date()
    const lastWeek = subWeeks(now, 1)

    const usersWhoHaveNotBetInAWeek: UserWhoNotBetInAWeek[] = []

    for (const user of users) {
      const bets = await Bet.query().where('user_id', user.id).orderBy('created_at', 'desc')
      const hasBetLastWeek = bets.some((bet) => isAfter(bet.createdAt.toJSDate(), lastWeek))

      if (!hasBetLastWeek) usersWhoHaveNotBetInAWeek.push({ name: user.name, email: user.email })
    }

    for (const user of usersWhoHaveNotBetInAWeek) {
      await Mail.send((message) => {
        message
          .from(Env.get('MAIL_FROM'))
          .to(user.email)
          .subject(`TGL Bets - Remember to bet!`)
          .htmlView('emails/remember_to_bet', { name: user.name })
      })
    }
  }
}
