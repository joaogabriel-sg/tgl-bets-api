import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    const newUser = await request.validate(CreateUserValidator)
    await User.create(newUser)

    return response.status(201).json({ message: 'Created user.' })
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
