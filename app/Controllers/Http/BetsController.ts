import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import CreateBetValidator from 'App/Validators/CreateBetValidator'

export default class BetsController {
  public async index({ auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const bets = await Bet.query().where('user_id', id).orderBy('created_at', 'desc')

    return bets
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const user = await auth.use('api').authenticate()
    const data = await request.validate(CreateBetValidator)

    data.bets.forEach(async (bet) => {
      await Game.findByOrFail('id', bet.id)
      await Bet.create({
        userId: user.id,
        gameId: bet.id,
        numbers: bet.numbers.join(','),
      })
    })

    return response.status(204)
  }

  public async show({ auth, params }: HttpContextContract) {
    const { betId } = params
    const { id } = await auth.use('api').authenticate()

    const bets = await Bet.query()
      .where('user_id', id)
      .andWhere('id', betId)
      .orderBy('created_at', 'desc')

    return bets[0] || {}
  }
}
