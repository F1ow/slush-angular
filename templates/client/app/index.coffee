class app extends App
  constructor: ->
    return[
      'Templates'
      'ngRoute'
    ]


class Setup extends Config
  constructor: ($routeProvider, $locationProvider) ->
    $locationProvider.html5Mode true

    $routeProvider
      .when '/',
        templateUrl: 'client/app/todo/todo.html'
        controller: 'Todo'

      .otherwise
        redirectTo: '/'