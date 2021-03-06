const Model = require("./ModelProduct");
const instance = require("../../../database");
const NotFound = require("../../../errors/NotFound");

module.exports = {
  list(idProvider) {
    return Model.findAll({
      where: {
        provider: idProvider,
      },
      raw: true,
    });
  },

  insert(data) {
    return Model.create(data);
  },

  delete(idProduct, idProvider) {
    return Model.destroy({
      where: {
        id: idProduct,
        provider: idProvider,
      },
    });
  },

  async getById(idProduct, idProvider) {
    const found = await Model.findOne({
      where: {
        id: idProduct,
        provider: idProvider,
      },
      raw: true, //Faz com que o retorno seja em js, não uma instância do sequelize
    });

    if (!found) {
      throw new NotFound("Produto");
    }

    return found;
  },
  update(productData, dataToUpdate) {
    return Model.update(dataToUpdate, {
      where: productData,
    });
  },
  subtract(idProduct, idProvider, field, quantity) {
    return instance.transaction(async (transaction) => {
      const product = await Model.findOne({
        where: {
          id: idProduct,
          provider: idProvider,
        },
      });

      product[field] = quantity;

      await product.save();
      return product;
    });
  },
};
