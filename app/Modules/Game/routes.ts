import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
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
}).prefix('v1')
