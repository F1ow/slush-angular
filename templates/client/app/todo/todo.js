var Todo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Todo = (function(_super) {
  __extends(Todo, _super);

  function Todo() {
    this.list = [
      {
        text: 'learn coffeescript',
        done: false
      }, {
        text: 'learn angular',
        done: false
      }, {
        text: 'learn gulp',
        done: true
      }
    ];
  }

  Todo.prototype.addTodo = function() {
    this.list.push({
      text: this.input,
      done: false
    });
    return this.input = '';
  };

  Todo.prototype.remaining = function() {
    var count, todo, _i, _len, _ref;
    count = 0;
    _ref = this.list;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      todo = _ref[_i];
      if (!todo.done) {
        count++;
      }
    }
    return count;
  };

  Todo.prototype.archive = function() {
    var oldList, todo, _i, _len;
    oldList = this.list;
    this.list = [];
    for (_i = 0, _len = oldList.length; _i < _len; _i++) {
      todo = oldList[_i];
      if (!todo.done) {
        this.list.push(todo);
      }
    }
    return this.search = '';
  };

  Todo.prototype.toggle = function(item) {
    return item.done = !item.done;
  };

  return Todo;

})(Controller);