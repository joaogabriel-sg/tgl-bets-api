import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PasswordRecoveryTokens extends BaseSchema {
  protected tableName = 'password_recovery_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('token').unique().notNullable()
      table.string('expires_in').notNullable()
      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
