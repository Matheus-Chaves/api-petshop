const router = require("express").Router();
const TableProvider = require("./TableProvider");
const SerializerProvider = require("../../Serializer").SerializerProvider;

router.options("/", (request, response) => {
  response.set("Access-Control-Allow-Methods", "GET");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.status(204).end();
});

router.get("/", async (request, response) => {
  await TableProvider.list().then((results) => {
    const serializer = new SerializerProvider(
      response.getHeader("Content-Type") //pegando o tipo de conteúdo do cabeçalho (definido no middleware na raiz da api)
    );
    response.status(200).send(
      //não necessário utilizar status 200, pois, por padrão, ja retorna 200
      serializer.serialize(results) //serializa os resultados, convertendo-os em json
    );
  });
});

module.exports = router;
