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
    response.set("ETag", product.version);
    const timestamp = new Date(product.updatedAt).getTime();
    response.set("Last-Modified", timestamp);
    response.set(
      "Location",
      `/api/providers/${product.provider}/products/${product.id}`
    );
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
      response.set("ETag", product.version);
      const timestamp = new Date(product.updatedAt).getTime();
      response.set("Last-Modified", timestamp);
      response.send(serializer.serialize(product));
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:id", async (request, response, next) => {
  const data = {
    ...request.body,
    id: request.params.id,
    provider: request.provider.id,
  };

  try {
    const product = new Product(data);
    await product.update();
    await product.load(); //com isso os dados serão atualizados dentro do objeto 'product'
    response.set("ETag", product.version);
    const timestamp = new Date(product.updatedAt).getTime();
    response.set("Last-Modified", timestamp);
    response.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post("/:id/decrease-stock", async (request, response, next) => {
  try {
    const product = new Product({
      id: request.params.id,
      provider: request.provider.id,
    });

    await product.load();
    product.stock = product.stock - request.body.quantity;
    await product.decreaseStock();
    await product.load(); //com isso os dados serão atualizados dentro do objeto 'product'
    response.set("ETag", product.version);
    const timestamp = new Date(product.updatedAt).getTime();
    response.set("Last-Modified", timestamp);
    response.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
