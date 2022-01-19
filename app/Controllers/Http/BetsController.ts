import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import CreateBetValidator from 'App/Validators/CreateBetValidator'
import { formatCurrencyToBRL } from 'App/Utils/formatCurrencyToBRL'

type MailBet = { type: string; numbers: string }
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

    const mailBets: MailBet[] = []

    let totalPrice = 0
    let isNumberLengthValid = true
    let areNumbersRangeValid = true

    for (const bet of data.bets) {
      const game = await Game.findByOrFail('id', bet.id)

      if (isNumberLengthValid && bet.numbers.length !== game.maxNumber) {
        isNumberLengthValid = false
      }

      const numbersRangeValidation = bet.numbers.every(
        (number) => number > 0 && number <= game.range
      )

      if (!numbersRangeValidation) {
        areNumbersRangeValid = false
      }

      totalPrice += game.price
    }

    if (totalPrice <= Env.get('MIN_CART_VALUE')) {
      return response.status(422).json({
        error: `Total price must be greater than ${formatCurrencyToBRL(
          Env.get('MIN_CART_VALUE')
        )}.`,
      })
    }

    if (!isNumberLengthValid) {
      return response.status(422).json({ error: 'Invalid numbers length in a bet.' })
    }

    if (!areNumbersRangeValid) {
      return response.status(422).json({ error: 'Invalid numbers range in a bet.' })
    }

    data.bets.forEach(async (bet) => {
      const game = await Game.findByOrFail('id', bet.id)

      await Bet.create({
        userId: user.id,
        gameId: bet.id,
        numbers: bet.numbers.join(','),
      })

      mailBets.push({
        type: game.type,
        numbers: bet.numbers.join(','),
      })
    })

    await Mail.send((message) => {
      message
        .from(Env.get('MAIL_FROM'))
        .to(user.email)
        .subject(`TGL Bets - Your new bets!`)
        .htmlView('emails/new_bet', { bets: mailBets })
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
