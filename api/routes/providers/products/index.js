const router = require("express").Router({ mergeParams: true });
const Table = require("./TableProduct");
const Product = require("./Product");
const Serializer = require("../../../Serializer").SerializerProduct;

router.get("/", async (request, response) => {
  const products = await Table.list(request.provider.id);
  const serializer = new Serializer(response.getHeader("Content-Type"));
  response.send(serializer.serialize(products));
});

router.post("/", async (request, response, next) => {
  try {
    const idProvider = request.provider.id;
    const body = request.body;
    const data = { ...body, provider: idProvider };
    const product = new Product(data);
    await product.create();
    const serializer = new Serializer(response.getHeader("Content-Type"));
    response.status(201).send(serializer.serialize(product));
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
      const serializer = new Serializer(response.getHeader("Content-Type"), [
        "price",
        "stock",
        "provider",
        "createdAt",
        "updatedAt",
        "version",
      ]);
      response.send(serializer.serialize(product));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
