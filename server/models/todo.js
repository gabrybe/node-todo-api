var mongoose = require("mongoose");

var todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// creiamo un Model(nome, schema)
var Todo = mongoose.model("Todo", todoSchema);

// per usare il model bisogna esportarlo!
module.exports = {Todo};