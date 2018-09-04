var mongoose = require("mongoose");

// qui lo schema è definito implicitamente con un oggetto js
var User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
    trim: true
  }
});

module.exports = {User};