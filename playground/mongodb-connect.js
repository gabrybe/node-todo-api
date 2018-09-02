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
  // insertOne(object, callback)
  var notes = [];
  for (let i = 0; i < 10; i++) {
    notes.push({text: `Note ${i} - Something to do ${i}`, completed: false});
  }

  notes.forEach((element, index, array) => {

    db.collection("Todos").insertOne(element, (err, result) => {
      if (err) {
        return console.log("Unable to insert in Todos collection", err)
      }
      // documents inseriti: in result.ops
      console.log(JSON.stringify(result.ops, undefined, 2));
    });

  });

  db.collection("Users").insertOne({
    name: "Gabry", age: 38, location: "Turin"
  }, (err, result) => {
    if (err) {
      return console.log("Unable to insert in Users collection", err);
    }

    // documents inseriti: in result.ops
    console.log(JSON.stringify(result.ops, undefined, 2));

    // quando è stato creato questo document?
    // l'object id contiene questa informazione
    console.log("Creation date: ", result.ops[0]._id.getTimestamp());
  });

  client.close();
});