const router = require("express").Router({ mergeParams: true });
const Table = require("./TableProduct");
const Product = require("./Product");

router.get("/", async (request, response) => {
  const products = await Table.list(request.provider.id);
  response.send(JSON.stringify(products));
});

router.post("/", async (request, response, next) => {
  try {
    const idProvider = request.provider.id;
    const body = request.body;
    const data = { ...body, provider: idProvider };
    const product = new Product(data);
    await product.create();
    response.status(201).send(product);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (request, response) => {
  const data = {
    id: request.params.id,
    provider: request.provider.id,
  };

  const product = new Product(data);
  await product.delete();
  response.status(204).end();
});

router.get("/:id", async (request, response, next) => {
  const data = {
    id: request.params.id,
    provider: request.provider.id,
  };

  const product = new Product(data);
  await product
    .load()
    .then(() => {
      response.send(JSON.stringify(product));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
