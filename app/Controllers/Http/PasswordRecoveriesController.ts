import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import crypto from 'crypto'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import Mail from '@ioc:Adonis/Addons/Mail'
import PasswordRecoveryToken from 'App/Models/PasswordRecoveryToken'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'

export default class PasswordRecoveriesController {
  public async forgotPassword({ request, response }: HttpContextContract) {
    const { email } = await request.validate(ForgotPasswordValidator)

    try {
      const user = await User.findBy('email', email)

      if (!user) {
        return response.status(404).json({ error: 'User not found.' })
      }

      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date()
      now.setHours(now.getHours() + 1)

      await PasswordRecoveryToken.create({
        token,
        expiresIn: now.toISOString(),
        userId: user.id,
      })

      await Mail.send((message) => {
        message
          .from(Env.get('MAIL_FROM'))
          .to(user.email)
          .subject(`TGL Bets - Recover your password!`)
          .htmlView('emails/forgot_password', { token })
      })

      return response.status(204)
    } catch {
      return response.status(400).json({ error: 'Error on forgot password, try again.' })
    }
  }

  public async resetPassword({ request, response }: HttpContextContract) {
    const { email, token, password } = await request.validate(ResetPasswordValidator)

    try {
      const userByEmail = await User.findBy('email', email)
      const tokenData = await PasswordRecoveryToken.findBy('token', token)

      if (!tokenData) {
        return response.status(400).json({ error: 'Invalid token.' })
      }

      const userByToken = await User.findBy('id', tokenData?.userId)

      if (!userByEmail || !userByToken) {
        return response.status(404).json({ error: 'User not found.' })
      }

      if (userByEmail.id !== userByToken.id) {
        return response.status(400).json({ error: 'Invalid user credentials.' })
      }

      const now = new Date().toISOString()

      if (now > tokenData.expiresIn) {
        return response.status(400).json({ error: 'Token expired, generate a new one.' })
      }

      userByEmail.password = password
      await userByEmail.save()

      await Mail.send((message) => {
        message
          .from(Env.get('MAIL_FROM'))
          .to(email)
          .subject(`TGL Bets - Successful password recovery!`)
          .htmlView('emails/successful_password_recovery')
      })

      return response.status(204)
    } catch {
      return response.status(400).json({ error: 'Cannot reset password, try again,' })
    }
  }
}
