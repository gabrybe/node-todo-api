const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
    trim: true,
    unique: true,
    validate: {
      //validator: (value) => { return validator.isEmail(value); }
      validator: validator.isEmail
    },
    message: '{value} is not a valid email'
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});
// instance methods; hanno accesso al singolo documento, quindi si usa una funzione "regolare" (non arrow che non ha il this)

// restituiamo al chiamante solo i dati "pubblici" dello user (non la password o i suoi token!)
UserSchema.methods.toJSON = function() {
  var userObject = this.toObject();

  return _.pick(userObject, ["_id", "email"]);
}

// in base ai dati dello user generiamo il suo token (richiamata quando si salva l'utente su db)
UserSchema.methods.generateAuthToken = function() {

  var access = "auth";
  var token = jwt.sign({_id: this._id.toHexString(), access}, "somesecretvalue");

  // usare "push" ha problemi con alcune versioni di mongodb
  //this.tokens.push({access, token});
  this.tokens = this.tokens.concat([{access, token}]);

  // se il valore di ritorno di una promise non è a sua volta una promise (e token non lo è), viene passato come "success value" alla prossima promise nella catena
  return this.save().then(() => {
    return token;
  });
}
// metodi "di classe" (del model)
// Verifichiamo il token e restituiamo lo user corrispondente
UserSchema.statics.findByToken = function(token) {

  // il "this" in questo caso è il modello
  // var User = this
  var decodedUser;

  try {
    decodedUser = jwt.verify(token, "somesecretvalue");
  } catch (err) {
    return Promise.reject("User not authorized");
  }

  // se il token è stato decodificato correttamente, si cerca lo user e si restituisce
  return User.findOne({
    "_id": decodedUser._id,
    // per cercare campi annidati, bisogna esprimerli come stringhe separate da punti
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

var User = mongoose.model("User", UserSchema);

module.exports = {User};