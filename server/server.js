var express = require("express");
var bodyParser = require("body-parser");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

var app = express();


// middleware
app.use(bodyParser.json());

// CRUD

// Create: post al server
app.post("/todos", (req, res) => {
  // creiamo un'istanza del model
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then((doc) => {
    // restituiamo al chiamante il documento appena inserito
    res.send(doc);
  }, (err) => {
    // oppure l'errore
    res.status(400).send(err);
  });

  console.log(req.body);
});

// Read: get al server
// GET /todos
// GET /todos/1232jd9824 per un object id specifico

app.listen(3000, () => {
  console.log("Started on port 3000");
});

/*
// creiaamo un'istanza del Model "Todo"
var newTodo = new Todo({
  text: "          New todo " + new Date()
}).save().then((doc) => {
  console.log("saved todo", doc);
}).catch((err) => {
  console.log("Unable to save todo: ", err);
});

// istanza del model user
var newUser = new User({
  email: "test@test.email.org"
}).save().then((doc) => {
  console.log("saved user", doc);
}).catch((err) => {
  console.log("Unable to save user: ", err);
});
*/

module.exports = {app};