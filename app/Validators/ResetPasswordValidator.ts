import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.email()]),
    token: schema.string({ trim: true }),
    password: schema.string({ trim: true }),
  })

  public messages = {
    'email.email': 'Invalid email address',
  }
}
