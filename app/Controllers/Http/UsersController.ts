import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import Bet from 'App/Models/Bet'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async index({ auth }: HttpContextContract) {
    const user = await auth.use('api').authenticate()

    const currentMonth = new Date().getMonth() + 1
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1

    const bets = await Bet.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .preload('game')

    const lastMonthBets = bets.filter((bet) => {
      const betMonth = bet.createdAt.month
      return betMonth === lastMonth
    })

    return { user, last_month_bets: lastMonthBets }
  }

  public async store({ auth, request }: HttpContextContract) {
    const newUser = await request.validate(CreateUserValidator)
    const user = await User.create(newUser)
    const token = await auth.use('api').attempt(newUser.email, newUser.password, {
      expiresIn: '30mins',
      name: newUser.email,
    })

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    }

    await Mail.send((message) => {
      message
        .from('no-reply@tglbets.com')
        .to(user.email)
        .subject('TGL Bets - You made a new bet')
        .htmlView('emails/welcome')
    })

    return { token, user: userWithoutPassword }
  }

  public async update({ auth, request }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const newUserData = await request.validate(UpdateUserValidator)

    const user = await User.findByOrFail('id', id)
    user.merge(newUserData)
    await user.save()

    const token = await auth.use('api').attempt(newUserData.email, newUserData.password, {
      expiresIn: '30mins',
      name: user.email,
    })

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    }

    return { token, user: userWithoutPassword }
  }

  public async destroy({ auth, response }: HttpContextContract) {
    const user = await auth.use('api').authenticate()

    try {
      await user.delete()
      return response.status(204)
    } catch {
      return response.status(400).json({ error: 'User not deleted.' })
    }
  }
}
