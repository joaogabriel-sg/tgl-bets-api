import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const uniquerKey = 'email'

    await User.updateOrCreateMany(uniquerKey, [
      {
        name: 'João Gabriel Silva Gomes',
        email: 'jgsg@email.com',
        password: 'admin',
        role: 'admin',
      },
      {
        name: 'Isabele da Silva Gonçalves',
        email: 'isa@email.com',
        password: 'player',
        role: 'player',
      },
    ])
  }
}
