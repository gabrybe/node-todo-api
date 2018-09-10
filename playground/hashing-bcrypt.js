const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var password = "123abc!";
// hashing della password: 1) generiamo il salt 2) hashing vero e proprio di password + salt

// genSalt([numero di iterazioni per generarlo], callback(err, salt))
bcrypt.genSalt(10, (err, salt) => {
  // hashing: hash(password, salt, callback(err, hash))
  bcrypt.hash(password, salt, (err, hash) => {
    // scriviamo l'hash sul db
    console.log(`Password  ${password}\nhash: ${hash}`);
  })
})

// verifichiamo l'hash ottenuto

var hashedPassword = "$2a$10$Vzo7eZ3aturGmz6bc4/EIeN0fC1QV4ZX74zlzK0HcyZn1jCsVbvyHm";

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log("Comparison result:",res);
})

var data = {
  id: 10
};
