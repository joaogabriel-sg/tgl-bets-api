import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateBetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    bets: schema.array().members(
      schema.object().members({
        id: schema.number([rules.exists({ table: 'games', column: 'id' })]),
        numbers: schema.array().members(schema.number()),
      })
    ),
  })

  public messages = {
    required: '{{ field }} is required',
    exists: 'Game not exists.',
  }
}
