import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async index({}: HttpContextContract) {}

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

    return { token, user: userWithoutPassword }
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
