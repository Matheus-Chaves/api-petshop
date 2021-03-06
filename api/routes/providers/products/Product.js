const Table = require("./TableProduct");
const DataNotFound = require("../../../errors/DataNotFound");
const InvalidField = require("../../../errors/InvalidField");
class Product {
  constructor({
    id,
    title,
    price,
    stock,
    provider,
    createdAt,
    updatedAt,
    version,
  }) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.stock = stock;
    this.provider = provider;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.version = version;
  }

  validate() {
    if (typeof this.title !== "string" || this.title.length === 0) {
      throw new InvalidField("title");
    }

    if (typeof this.price !== "number" || this.price.length === 0) {
      throw new InvalidField("price");
    }
  }

  async create() {
    this.validate();
    const result = await Table.insert({
      title: this.title,
      price: this.price,
      stock: this.stock,
      provider: this.provider,
    });

    this.id = result.id;
    this.createdAt = result.createdAt;
    this.updatedAt = result.updatedAt;
    this.version = result.version;
  }

  async delete() {
    await Table.delete(this.id, this.provider);
  }

  async load() {
    const product = await Table.getById(this.id, this.provider);
    this.title = product.title;
    this.price = product.price;
    this.stock = product.stock;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
    this.version = product.version;
  }

  async update() {
    const dataToUpdate = {};

    if (typeof this.title === "string" && this.title.length > 0) {
      dataToUpdate.title = this.title;
    }

    if (typeof this.price === "number" && this.price > 0) {
      dataToUpdate.price = this.price;
    }

    if (typeof this.stock === "number") {
      dataToUpdate.stock = this.stock;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new DataNotFound();
    }

    return Table.update(
      {
        id: this.id,
        provider: this.provider,
      },
      dataToUpdate
    );
  }

  decreaseStock() {
    return Table.subtract(this.id, this.provider, "stock", this.stock);
  }
}

module.exports = Product;
