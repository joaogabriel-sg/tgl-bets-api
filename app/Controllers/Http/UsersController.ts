import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    const name = request.input('name')
    const email = request.input('email')
    const password = request.input('password')
    const role = request.input('role')

    const newUser = { name, email, password, role }

    try {
      await User.create(newUser)
      return response.status(201).json({ message: 'Created user.' })
    } catch (error) {
      return response.status(422).json({ error: 'Invalid credentials.' })
    }
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
