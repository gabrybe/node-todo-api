const {ObjectID} = require("mongodb");
const jwt = require("jsonwebtoken");
const {Todo} = require("./../../models/todo.js");
const {User} = require("./../../models/user.js");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: new ObjectID(),
  email: "gabriele.bernuzzi@gmail.com",
  password: "userOnePass",
  tokens: [{
    access: "auth",
    // come in user.generateAuthToken()
    token: jwt.sign({_id: userOneId.toHexString(), access: "auth"}, "somesecretvalue")
  }]
}, {
  _id: userTwoId,
  email: "test.email@gmail.com",
  password: "userTwoPass"
}];

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
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  }, (err) => {console.log(err); done()}).then(() => done());
};

const populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    // Promise.all attende che l'array di promises in ingresso siano tutte risolte:
    // cioè quando tutti e due gli users sono stati salvati; il return di una promise consente di invocare un then()  dopo questa funzione
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {
  todos, populateTodos,
  users, populateUsers
};