const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");

var data = {
  id: 10
};

// due metodi: uno per creare token, uno per verificare token
var token = jwt.sign(data, "123abc");
console.log(token);
var decodedResult = jwt.verify(token, "123abc");
console.log(decodedResult);
