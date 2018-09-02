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

  // deleteOne: cancella un document
  db.collection("Todos").deleteOne({text: "Note 9 - Something to do 9"}).then((result) => {
    //console.log(result);
  });

  // findOneAndDelete: cancella un document e restituisce i suoi dati
  db.collection("Todos").findOneAndDelete({text: "Note 7 - Something to do 7"}).then((result) => {
    console.log(result);
  });

  // deleteMany: cancella più documents
  db.collection("Todos").deleteMany({text: "Note 7 - Something to do 7"}).then((result) => {
    //console.log(result);
  });

  // pulizia finale di tutte le collections
  ["Todos", "Users"].forEach((element, index, array) => {
    db.collection(element).deleteMany({}).then((result) => {
      console.log("Deleted all");
    }, (err) => {
      console.log("Error in deleteMany", err);
    });
  });

  client.close();
});