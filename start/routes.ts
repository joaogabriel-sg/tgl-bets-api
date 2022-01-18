/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/login', 'AuthController.login')

  Route.group(() => {
    Route.get('/', 'BetsController.index')
    Route.get('/:betId', 'BetsController.show')
    Route.post('/', 'BetsController.store')
  })
    .prefix('/bets')
    .where('id', /^[0-9]+$/)
    .middleware(['auth'])

  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'GamesController.index')
      Route.get('/:gameId', 'GamesController.show')
    })

    Route.group(() => {
      Route.post('/', 'GamesController.store')
      Route.put('/:gameId', 'GamesController.update')
      Route.delete('/:gameId', 'GamesController.destroy')
    }).middleware(['auth'])
  })
    .prefix('/games')
    .where('id', /^[0-9]+$/)

  Route.group(() => {
    Route.group(() => {
      Route.post('/', 'UsersController.store')
    })

    Route.group(() => {
      Route.get('/', 'UsersController.index')
      Route.put('/', 'UsersController.update')
      Route.delete('/', 'UsersController.destroy')
    }).middleware(['auth'])
  })
    .prefix('/users')
    .where('id', /^[0-9]+$/)
}).prefix('v1')
