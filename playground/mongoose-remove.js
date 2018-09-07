const {ObjectID} = require("MongoDB");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");

var id = "5b91843733303b29702edbb8";

Todo.findOneAndDelete({_id: new ObjectID("5b925442f683fe323025e6ed")}).then((result) => {
  console.log("Find One and Remove", result);
});
/*
Todo.findByIdAndRemove("5b92548cf683fe323025e6ee").then((result) => {
  console.log("Findbyid and remove", result);
})

Todo.deleteMany({}).then((result) => {
  console.log("delete many", result);
});
*/

setTimeout(() => { process.exit(0) }, 2500);