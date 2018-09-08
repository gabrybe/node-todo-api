var {User} = require("./../models/user");

// creiamo un middleware per autenticare le routes
var authenticate = (req, res, next) => {
  // verifichiamo se c'è il token
  var token = req.header("x-auth");

  User.findByToken(token).then((user) => {
    // utente non trovato
    if (!user) {
      // in questo modo si entra nel catch sotto (utile tecnica per non ripetere il codice di restituzione 401)
      return Promise.reject("User not found");
    }

    // modifichiamo la request in modo che sia disponibile lo user ed il token (ora che lo user è autenticato)
    req.user = user;
    req.token = token;

    // si invoca il next per proseguire con il processing delle routes successive (altrimenti si rimane bloccati qui)
    next();

  }).catch((err) => {
    // nel caso l'utente non sia autorizzato, si spedisce un 401
    // user.js ha restituito una Promise.reject()
    res.status(401).send(err);
  });
};

module.exports = {authenticate};