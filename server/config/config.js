// esiste solo su heroku, dobbiamo configurarla in package.json; così possiamo aggiungere if per fare switching tra DB di sviluppo e ufficiale
var env = process.env.NODE_ENV || "development";

switch (env) {
  // in "production" esiste già la variabile di ambiente MONGODB_URI
  case "test":
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp-Test";
  break;

  case "development":
  default:
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
  break;
}
console.log("Environment: ", env);