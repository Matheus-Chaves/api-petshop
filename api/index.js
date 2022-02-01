const express = require("express");
const app = express();
const config = require("config");
const NotFound = require("./errors/NotFound");
const InvalidField = require("./errors/InvalidField");
const DataNotFound = require("./errors/DataNotFound");
const UnsupportedValue = require("./errors/UnsupportedValue");
const acceptedFormats = require("./Serializer").acceptedFormats;
const SerializerError = require("./Serializer").SerializerError;

app.use(express.json());

app.use((request, response, next) => {
  //esse middleware é executado SEMPRE que o app recebe alguma solicitação
  let requestedFormat = request.header("Accept");

  if (requestedFormat === "*/*") {
    //Caso o formato 'Accept' do cabeçalho for o padrão (*/*), formato que aceita qualquer tipo de dado
    requestedFormat = "application/json"; //força-se a conversão do cabeçalho para json
  }

  if (acceptedFormats.includes(requestedFormat)) {
    response.setHeader("Content-Type", requestedFormat);
    response.set("X-Powered-By", "Gatito Petshop"); //Colocando Gatito no lugar de "X-Powered-By: Express"
    next();
  } else {
    response.status(406).end();
  }
});

app.use((request, response, next) => {
  response.set("Access-Control-Allow-Origin", "*"); //Permite que a API seja acessada de qualquer navegador sem gerar o erro CORS
  next();
});

const router = require("./routes/providers/index");
app.use("/api/providers", router);

app.use((err, request, response, next) => {
  //Cria um middleware, função que pode ser acessada pelas rotas
  let status = 500; //Numero de erro padrão

  if (err instanceof NotFound) {
    status = 404;
  } else if (err instanceof InvalidField || err instanceof DataNotFound) {
    status = 400;
  } else if (err instanceof UnsupportedValue) {
    status = 406;
  }

  const serializador = new SerializerError(response.getHeader("Content-Type"));

  response.status(status);
  response.send(
    serializador.serialize({
      message: err.message,
      id: err.idError,
    })
  );
});

app.listen(config.get("api.port"), () => console.log("http://localhost:3000"));
