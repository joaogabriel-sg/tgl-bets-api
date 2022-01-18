import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
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
