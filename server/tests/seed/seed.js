const {ObjectID} = require("mongodb");

const {Todo} = require("./../../models/todo.js");

const todos = [{
  _id: new ObjectID(),
  text: "Test todo 1 text:" + new Date()
}, {
  _id: new ObjectID(),
  text: "Test todo 2 text:" + new Date(),
  completed: true,
  completedAt: 333
}];

// prima di ogni test
const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }, (err) => {console.log(err); done()}).then(() => done());
};

module.exports = {
  todos, populateTodos
};