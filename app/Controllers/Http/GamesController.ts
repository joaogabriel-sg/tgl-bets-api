import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'
import GameValidator from 'App/Validators/GameValidator'

export default class GamesController {
  public async index({}: HttpContextContract) {
    const minCartValue = Env.get('MIN_CART_VALUE')
    const games = await Game.all()

    return { min_cart_value: minCartValue, games }
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(GameValidator)

    try {
      const newGame = await Game.create(data)
      return newGame
    } catch (err) {
      return response.status(err.status).json({ error: err.message })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const { gameId } = params

    try {
      const game = await Game.findOrFail(gameId)
      return game
    } catch (err) {
      return response.status(err.status).json({ error: err.message })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    const { gameId } = params
    const data = await request.validate(GameValidator)

    try {
      const game = await Game.findByOrFail('id', gameId)

      game.merge(data)
      await game.save()

      return game
    } catch (err) {
      return response.status(err.status).json({ error: err.message })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const { gameId } = params

    try {
      const game = await Game.findByOrFail('id', gameId)
      await game.delete()
      return response.status(204)
    } catch (err) {
      return response.status(err.status).json({ error: err.message })
    }
  }
}
