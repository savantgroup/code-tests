/*

This to-do app makes use ECMAScript 2015 and jQuery.
It should be included after the jQuery script tag.

Example usage:

    $(function() {
        var display = $('#todo-list');
        var errors = $('#errors');
        init(display, errors);
    });

*/

function getUrl(todoItem) {
  if (todoItem) {
    return 'http://localhost:8100/todo/' + todoItem.id + '/';
  } else {
    return 'http://localhost:8100/todo/';
  }
}

var displayNode = null;
var errorsNode = null;
var todoList = null;

function init(_displayNode, _errorsNode) {
  displayNode = _displayNode;
  errorsNode = _errorsNode;
  getTodoItems();
}

// MODELS

class TodoList {
  constructor(_items) { this.items = _items; }

  add(item) { this.items.push(item); }

  remove(item) {
    let index = this.items.indexOf(item);
    this.items.splice(index, 1); // Remove the item.
  }

  render() {
    var ulNode = $('<ul></ul>');
    for (var child of this.items) {
      ulNode.append(child.render());
    }
    var inputNode = $('<input type="text" placeholder="Add an item.">')
                        .keypress(function(event) {
                          let key = event.which;
                          if (key === 13) { // On Enter.
                            let content = inputNode.val();
                            let item = new TodoItem(null, content);
                            createTodoItem(item);
                          }
                        });
    var containerNode = $('<div></div>');
    containerNode.append(ulNode);
    containerNode.append(inputNode);
    return containerNode;
  }
}

class TodoItem {
  constructor(id, content) {
    this.id = id;
    this.content = content;
  }

  render() {
    var button =
        $('<button>X</button>')
            .click(() => deleteTodoItem(this, renderTodoItems, displayErrors));
    var node = $('<li>' + this.content + '</li>');
    node.append(button);
    return node;
  }
}

// VIEWS

function renderTodoItems() {
  displayNode.empty();
  displayNode.append(todoList.render());
}

function displayErrors(errors) {
  var ulNode = $('<ul></ul>');
  for (let err of errors) {
    err = $('<li>' + err + '</li>');
    ulNode.append(err);
  }
  errorsNode.empty();
  errorsNode.append(ulNode);
}

// REQUESTS
//
// Requests parse the data and move the program logic forward.
// Ideally, there would be better separation, but this is good
// enough for a demo app.
//

function handleErrors(xhr, textStatus, errorThrown) {
  var errorsData = JSON.parse(xhr.responseText);
  displayErrors(errorsData.errors || [ 'Unknown error' ]);
}

function getTodoItems() {
  $.ajax({
    url : getUrl(),
    method : 'GET',
    success : function(data, textStatus, xhr) {
      if (xhr.status == 200) {
        var items = data['results'].map(function(itemData) {
          return new TodoItem(itemData.id, itemData.content);
        });
        todoList = new TodoList(items);
        renderTodoItems();
      } else {
        displayErrors('Unknown error!');
      }
    },
    error : handleErrors,
  });
}

function deleteTodoItem(todoItem) {
  $.ajax({
    url : getUrl(todoItem),
    method : 'DELETE',
    success : function(data, textStatus, xhr) {
      if (xhr.status == 204) {
        todoList.remove(todoItem);
        renderTodoItems();
      } else {
        displayErrors('Unknown error!');
      }
    },
    error : handleErrors,
  });
}

function createTodoItem(todoItem) {
  $.ajax({
    url : getUrl(),
    contentType : 'application/json',
    method : 'POST',
    data : JSON.stringify({'content' : todoItem.content}),
    success : function(data, textStatus, xhr) {
      if (xhr.status == 201) {
        var item = new TodoItem(data.id, data.content);
        todoList.add(item);
        renderTodoItems();
      } else {
        displayErrors('Unknown error!');
      }
    },
    error : handleErrors,
  });
}

// TODO: Handle editing data!
