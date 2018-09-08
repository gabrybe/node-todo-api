const {SHA256} = require("crypto-js");

var message = "I am user number 3";

var hashedMessage = SHA256(message).toString();

console.log([message,hashedMessage]);

var data = {
  id: 4
};
var token = {
  data,
  // hash + salt (salt: aggiungiamo una stringa in modo che il client non sia in grado di manipolare i dati -perché la stringa "somesecretsalt" non è conosciuta dal client, ma usata per criptare il messaggio)
  hash: SHA256(JSON.stringify(data) + "somesecretsalt").toString()
}

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

// valutiamo che il token non sia stato manipolato
var resultHash = SHA256(JSON.stringify(token.data)
   + "somesecretsalt").toString();

if (resultHash === token.hash) {
  console.log("Data not manipulated nor changed")
} else {
  console.log("Data was changed. Don't trust!");
}