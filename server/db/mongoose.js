var mongoose = require("mongoose");

// bisogna indicare a mongoose quale libreria di Promises si utilizza: usiamo quella builtin
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

module.exports = {
  mongoose: mongoose
  // potrei scrivere anche solo "mongoose" in ES6: module.exports = {mongoose}
}