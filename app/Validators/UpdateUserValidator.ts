import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.minLength(2)]),
    email: schema.string({ trim: true }, [rules.email()]),
    password: schema.string({ trim: true }),
  })

  public messages = {
    'required': '{{ field }} is required.',
    'name.minLength': 'Name must have two or more characters.',
    'email.email': 'Invalid email address.',
    'email.unique': 'Email already exists.',
  }
}
