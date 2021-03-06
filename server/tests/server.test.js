﻿const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("MongoDB");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");

const {todos, populateTodos, users, populateUsers} = require("./seed/seed.js");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
  it("should create a new todo", (done) => {
    var text = "Test todo text:" + new Date();

    request(app)
      .post("/todos")
      // inviamo un oggetto, che supertest trasformerà in json; tale oggetto ha una sola proprietà,"text", inizializzata con il valore della variabile "text" di riga 9
      .send({_id: new ObjectID(), text})
      .expect(200)
      .expect((res) => {
        // ci aspettiamo che nella risposta ci sia il testo creato
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        return done();

        if (err) {
          return done(err);
        }

        // non ci sono errori: query sul database per verificare che il dato sia stato scritto
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));

      });
  });

  it("should not create todo with invalid body data", (done) => {
    var text = "";

    request(app)
      .post("/todos")
      // inviamo un oggetto, che supertest trasformerà in json; tale oggetto ha una sola proprietà,"text", inizializzata con il valore della variabile "text" di riga 9
      .send({text})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(0);
          done();
        }).catch((err) => done(err));
      });

  });

});

describe("GET todos/:id", () => {

  it("should return an object", (done) => {

    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should return 404 if todo not found", (done) => {
    // creo un nuovo objectid, quindi sicuramente non può esistere già sul DB
    var id = new ObjectID();

    request(app)
      .get(`/todos/${id.toHexString()}`)
      .expect(404)
      .end(done);

  });

  it("should return 404 if id is invalid", (done) => {
    var id = "1234";

    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);

  });

});

// UPDATE
describe("PATCH todos/:id", () => {
  var hexId = todos[1]._id.toHexString();
  var updatedTodoData = {completed: false, text: "Not really completed"};

  it("should update a todo removing completedAt and setting completed to false", (done) => {

    request(app)
      .patch(`/todos/${hexId}`)
      .send(updatedTodoData)
      .expect(200)
      .expect((res) => {
        // expect(res.body.todo.text).toBe(todos[0].text);
        // expect(res.body.todo.completed).toBe(true);
        // expect(res.body.todo.completedAt).toNotExist();
        expect(res.body.todo).toInclude({
          completed: false,
          completedAt: null
        });

      })
      .end(done);
  });

  it("should update a todo setting completed to true", (done) => {

    request(app)
      .patch(`/todos/${hexId}`)
      .send({completed: true, text: "Now Completed"})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).toInclude({
          completed: true,
          text: "Now Completed"
        });
        expect(res.body.todo.completedAt).toBeA("number");

      })
      .end(done);
  });

  it("should return 404 if todo not found", (done) => {
    // creo un nuovo objectid, quindi sicuramente non può esistere già sul DB
    var id = new ObjectID();

    request(app)
      .patch(`/todos/${id.toHexString()}`)
      .send(updatedTodoData)
      .expect(404)
      .end(done);

  });

  it("should return 404 if id is invalid", (done) => {
    var id = "1234";

    request(app)
      .patch(`/todos/${id}`)
      .send(updatedTodoData)
      .expect(404)
      .end(done);

  });

});

describe("DELETE todos/:id", () => {
  var hexId = todos[0]._id.toHexString();

  it("should return an object", (done) => {

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((err) => done(err));
      });
  });

  it("should return 404 if todo not found", (done) => {
    // creo un nuovo objectid, quindi sicuramente non può esistere già sul DB
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);

  });

  it("should return 404 if id is invalid", (done) => {
    var id = "1234";

    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);

  })

});

describe("GET /users/me", () => {
  it("should return user if authenticated", (done) => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should return 401 if not authenticated", (done) => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done);
  });
});