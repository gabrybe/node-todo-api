const {ObjectID} = require("MongoDB");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");

var id = "5b91843733303b29702edbb8";

if (!ObjectID.isValid(id)) {
  console.log(`Id ${id} not valid`);
  process.exit(1);
}
/*

Todo.find().then((todos) => {
  console.log(todos);
}).catch();

Todo.find({_id: id}).then((todos) => {
  console.log(todos);
}).catch();

Todo.findOne({_id: id}).then((todo) => {
  console.log(todo);
});

*/
Todo.findById(id).then((todo) => {
  if (!todo) {
    return console.log(`Id ${id} not found.`)
  }
  console.log(todo);
});


setTimeout(() => { process.exit(0) }, 2500);