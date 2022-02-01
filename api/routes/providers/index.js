const router = require("express").Router();
const TableProvider = require("./TableProvider");
const Provider = require("./Provider");
const SerializerProvider = require("../../Serializer").SerializerProvider;

router.options("/", (request, response) => {
  response.set("Access-Control-Allow-Methods", "GET, POST");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.status(204).end();
});

router.get("/", async (request, response) => {
  await TableProvider.list().then((results) => {
    const serializer = new SerializerProvider(
      response.getHeader("Content-Type"), //pegando o tipo de conteúdo do cabeçalho (definido no middleware na raiz da api)
      ["company"]
    );
    response.status(200).send(
      //não necessário utilizar status 200, pois, por padrão, ja retorna 200
      serializer.serialize(results) //serializa os resultados, convertendo-os em json
    );
  });
});

router.post("/", async (request, response, next) => {
  const receivedData = request.body;
  const provider = new Provider(receivedData);
  await provider
    .create()
    .then(() => {
      const serializer = new SerializerProvider(
        response.getHeader("Content-Type"),
        ["company"]
      );
      response.status(201).send(serializer.serialize(provider));
    })
    .catch((err) => {
      next(err);
    });
});

router.options("/:idProvider", (request, response) => {
  response.set("Access-Control-Allow-Methods", "GET, PUT, DELETE");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.status(204).end();
});

router.get("/:idProvider", async (request, response, next) => {
  const id = request.params.idProvider;
  const provider = new Provider({ id: id });
  await provider
    .load()
    .then(() => {
      const serializer = new SerializerProvider(
        response.getHeader("Content-Type"),
        ["email", "company", "createdAt", "updatedAt", "version"]
      );
      response.status(200).send(serializer.serialize(provider));
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:idProvider", async (request, response, next) => {
  //"next" recebe a função do middleware localizado na raiz (index.js) do projeto
  const id = request.params.idProvider;
  const receivedData = request.body;
  //const data = Object.assign({}, receivedData, { id: id }) OR YOU CAN:
  const data = { ...receivedData, id };
  const provider = new Provider(data);
  await provider
    .update()
    .then(() => {
      response.status(204);
      response.end(/*`Fornecedor com id ${id} atualizado com sucesso.`*/); //com status = 204, a mensagem não é recebida
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/:idProvider", async (request, response, next) => {
  const id = request.params.idProvider;
  const provider = new Provider({ id: id });
  await provider
    .delete()
    .then(() => {
      response.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

const routerProducts = require("./products");

const verifyProvider = async (request, response, next) => {
  const id = request.params.idProvider;
  const provider = new Provider({ id: id });
  await provider.load().catch((err) => {
    next(err);
  });
  request.provider = provider; //Injeta o objeto 'provider' dentro do objeto request
  next();
};

//O parâmetro "idProvider" só irá existir nessa rota, pois o express deixa o parâmetro apenas neste escopo
//Ou seja, não é possível acessar o parâmetro "idProvider" dentro da nossa rota filha - em products/index.js
//Para isso é necessário adicionar { mergeParams: true } no nosso roteador filho - products/index.js
//Ao acessar a rota abaixo, as duas funções são executadas ->
//Primeiro um middleware para tratar erros (que levará o erro à raiz da aplicação) e depois nossa rota de produtos
router.use("/:idProvider/products", verifyProvider, routerProducts);

module.exports = router;
