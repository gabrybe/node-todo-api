const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");

// prima di ogni test
beforeEach((done) => {
  // si cancellano tutti i todo, e alla fine si invoca done() per proseguire con i test
  Todo.deleteMany({}).then(() => done());
});

describe("POST /todos", () => {
  it("should create a new todo", (done) => {
    var text = "Test todo text:" + new Date();

    request(app)
      .post("/todos")
      // inviamo un oggetto, che supertest trasformerà in json; tale oggetto ha una sola proprietà,"text", inizializzata con il valore della variabile "text" di riga 9
      .send({text})
      .expect(200)
      .expect((res) => {
        // ci aspettiamo che nella risposta
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // non ci sono errori: query sul database per verificare che il dato sia stato scritto
        Todo.find().then((todos) => {
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
        Todo.find().then((todos) => {
          expect(todos.length).toBe(0);
          done();
        }).catch((err) => done(err));
      });

  });
})