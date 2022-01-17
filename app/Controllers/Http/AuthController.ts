import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import AuthValidator from 'App/Validators/AuthValidator'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const userData = await request.validate(AuthValidator)

    try {
      const user = await User.findBy('email', userData.email)

      if (!user) {
        return response.status(404).json({ error: 'User not found.' })
      }

      const token = await auth.use('api').attempt(userData.email, userData.password, {
        expiresIn: '30mins',
        name: user?.serialize().email,
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
    } catch {
      return response.status(400).json({ error: 'Invalid credentials.' })
    }
  }
}
