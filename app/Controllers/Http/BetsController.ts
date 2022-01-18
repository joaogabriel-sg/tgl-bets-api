import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import CreateBetValidator from 'App/Validators/CreateBetValidator'

export default class BetsController {
  public async index({ auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const bets = await Bet.query()
      .where('user_id', id)
      .orderBy('created_at', 'desc')
      .preload('game')

    const formattedBets = bets.map((bet) => ({
      id: bet.id,
      numbers: bet.numbers,
      created_at: bet.createdAt,
      updated_at: bet.updatedAt,
      game: {
        id: bet.game.id,
        type: bet.game.type,
        description: bet.game.description,
        range: bet.game.range,
        price: bet.game.price,
        max_number: bet.game.maxNumber,
        color: bet.game.color,
      },
    }))

    return formattedBets
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

  public async show({ auth, params, response }: HttpContextContract) {
    const { betId } = params
    const { id } = await auth.use('api').authenticate()

    const bets = await Bet.query()
      .where('user_id', id)
      .andWhere('id', betId)
      .orderBy('created_at', 'desc')
      .preload('game')

    const bet = bets[0]

    if (!bet) {
      return response.status(404).json({ error: 'Bet not found.' })
    }

    const formattedBet = {
      id: bet.id,
      numbers: bet.numbers,
      created_at: bet.createdAt,
      updated_at: bet.updatedAt,
      game: {
        id: bet.game.id,
        type: bet.game.type,
        description: bet.game.description,
        range: bet.game.range,
        price: bet.game.price,
        max_number: bet.game.maxNumber,
        color: bet.game.color,
      },
    }

    return formattedBet
  }
}
