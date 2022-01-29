const Model = require("./ModelProduct");

module.exports = {
  list(idProvider) {
    return Model.findAll({
      where: {
        provider: idProvider,
      },
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
};
