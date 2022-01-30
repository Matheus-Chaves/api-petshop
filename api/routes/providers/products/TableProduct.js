const Model = require("./ModelProduct");

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
      throw new Error("O produto não foi encontrado!");
    }

    return found;
  },
  update(productData, dataToUpdate) {
    return Model.update(dataToUpdate, {
      where: productData,
    });
  },
};
