const Table = require("./TableProduct");

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
      throw new Error("O campo 'title' está inválido.");
    }

    if (typeof this.price !== "number" || this.price.length === 0) {
      throw new Error("O campo 'price' está inválido.");
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
}

module.exports = Product;
