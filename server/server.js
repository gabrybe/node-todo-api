// include questo file
require("./config/config.js");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");
var {authenticate} = require("./middleware/authenticate");

var app = express();

const port = process.env.PORT;

// per eliminare alcuni deprecation warnings nel richiamo di findByIdAndUpdate
mongoose.set('useFindAndModify', false);

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

});

// Read: get al server
// GET /todos
app.get("/todos", (req, res) => {
  Todo.find().then((todos) => {
    res.send(todos);
  }, (err) => {
    res.status(400).send(err);
  })
});

// GET /todos/1232jd9824 per un object id specifico
app.get("/todos/:id", (req, res) => {

  // return res.send(req.params);
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send(`Invalid id ${req.params.id}`);
  }

  Todo.findById(req.params.id).then((todo) => {
    if (!todo) {
      return res.status(404).send(`Todo ${req.params.id} not found.`);
    }

    res.send({todo});

  }, (err) => {
    res.status(400).send(err);
  });
});

// DELETE resource
app.delete("/todos/:id", (req, res) => {
  // return res.send(req.params);
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send(`Invalid id ${req.params.id}`);
  }

  Todo.findByIdAndDelete(req.params.id).then((todo) => {
    if (!todo) {
       return res.status(404).send(`Todo ${req.params.id} not found.`);
    }
    res.send({todo});
  }).catch((err) => {
    res.status(400).send(err);
  });

});

// metodo http per aggiornare una risorsa
app.patch("/todos/:id", (req, res) => {
  var id = req.params.id;
  // pick() recupera da un oggetto, una serie di proprietà (se esistono)
  var body = _.pick(req.body, ["text", "completed"]);


  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send(`Invalid id ${req.params.id}`);
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime(); // restituisce una js timestamp (millisecondi dal 1/1/70)
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // aggiorniamo il documento con il body
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {

    if (!todo) {
      return res.status(404).send("Todo not defined");
    }

    res.send({todo});

  }).catch((err) => {
    return res.status(400).send(err);
  });

});

// Login
app.post("/users", (req, res) => {
  // creiamo un'istanza del model
  // pick() recupera da un oggetto, una serie di proprietà (se esistono)
  var body = _.pick(req.body, ["email", "password"]);

  // in body ci sono già tutti e soli i campi che valorizzano uno User
  var user = new User(body);

  // posso omettere l'argument "user" alla funzione richiamata al then(), perché si tratta dello stesso oggetto "user" creato sopra
  //user.save().then((user) => {
  user.save().then(() => {
    // restituiamo al chiamante lo user appena inserito
    return user.generateAuthToken();
  }).then((token) => {
    // inviamo anche un custom header di autorizzazione con il token
    res.header("x-auth", token).send(user);
  }).catch((err) => {
    // oppure l'errore
    console.log(err);
    res.status(400).send(err);
  });

});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
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