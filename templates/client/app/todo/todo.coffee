class Todo extends Controller

  constructor: ->
    @list = [
      {
        text: 'learn coffeescript',
        done: false
      }
      {
        text: 'learn angular',
        done: false
      }
      {
        text: 'learn gulp',
        done: true
      }
    ]


  addTodo: ->
    @list.push
      text: @input
      done: false
    @input = ''

  remaining: ->
    count = 0
    for todo in @list
      count++ unless todo.done
    count

  archive: ->
    oldList = @list
    @list = []
    for todo in oldList
      unless todo.done
        @list.push todo
    @search = ''

  toggle: (item) ->
    item.done = !item.done
