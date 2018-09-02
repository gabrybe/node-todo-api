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

  // findOneAndUpdate(): aggiorna un document e ne restituisce i dati
  db.collection("Todos").findOneAndUpdate(
    { "text": "Note 4 - Something to do 4"},
    { $set: { "text": "Modificato nota 4", completed: true}},
    { returnNewDocument: false }
  ).then((result) => {
    console.log(result);
  });

  // aggiornamento users
  db.collection("Users").findOneAndUpdate(
    {_id: new ObjectID("5b8c4aab7bb41c4b00abb49f")},
    {$set: {name: "Gabry" + new Date()}, $inc: {age: 1}},
    {returnOriginal: false}
    ).then((result) => {
      console.log(result);
    }, (err) => {
      console.log("Error in incrementing user age.", err);
    });

  client.close();
});