// const MongoClient = require("mongodb").MongoClient;
// const ObjectID = require("mongodb").ObjectID

// stesse operazioni di cui sopra, ma con object destructuring di es6
const {MongoClient, ObjectID} = require("mongodb");

// creo un nuovo object id (non serve necessariamente solo con mongodb)
var objId = new ObjectID();
console.log(objId);

// url del db, opzioni, callback da eseguire quando la connessione è avvenuta con successo (oppure no)
MongoClient.connect("mongodb://localhost:27017/TodoApp", { useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server", err);
  }

  console.log("Connected to MongoDB server");
  const db = client.db("TodoApp");

  // mongodb crea in automatico le collection se non esistono
  // toArray() restitusce una Promise
  db.collection("Todos").find({completed: false}).toArray().then((docs) => {
    console.log("Todos", JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log("Unable to fetch todos", err)
  });

  // per leggere un object id specifico bisogna passare da ObjectID(), non da una stringa
  db.collection("Todos").find({
    _id: new ObjectID("5b8bd7a4b853261efc4648e8")
  }).toArray().then((docs) => {
    console.log("Todos", JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log("Unable to fetch todos", err)
  });

  // conteggio dei record
  db.collection("Users").find().count().then((count) => {
    console.log(count);
  }, (err) => {
    console.log(err)
  });

  client.close();
});