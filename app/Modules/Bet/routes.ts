import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'BetsController.index')
    Route.get('/:betId', 'BetsController.show')
    Route.post('/', 'BetsController.store')
  })
    .prefix('/bets')
    .where('id', /^[0-9]+$/)
    .middleware(['auth'])
}).prefix('v1')
