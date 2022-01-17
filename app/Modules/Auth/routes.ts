import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/login', 'AuthController.login')
}).prefix('v1')
