app = angular.module 'app', ['ui.router', 'templates']

class Setup extends Config
  constructor: ($locationProvider, $urlRouterProvider, $stateProvider) ->
    $locationProvider.html5Mode true
    $urlRouterProvider.otherwise '/'

    $stateProvider
      .state 'todo',
        url: '/'
        templateUrl: 'client/app/todo/todo.html'
        controller: 'todo'