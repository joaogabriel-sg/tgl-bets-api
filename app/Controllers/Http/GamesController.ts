import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'

export default class GamesController {
  public async index({}: HttpContextContract) {
    const minCartValue = 30
    const games = await Game.all()

    return { min_cart_value: minCartValue, games }
  }

  public async store({}: HttpContextContract) {}

  public async show({ params, response }: HttpContextContract) {
    const { gameId } = params

    try {
      const game = await Game.findOrFail(gameId)
      return game
    } catch {
      return response.notFound({ error: 'Game not found.' })
    }
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
