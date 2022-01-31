const Model = require("./ModelProvider");
const NotFound = require("../../errors/NotFound");

module.exports = {
  list() {
    return Model.findAll({ raw: true }); //O raw serve para fazer o Sequelize retornar o dado como um objeto javascript
  },
  insert(provider) {
    return Model.create(provider);
  },
  async getById(id) {
    const found = await Model.findOne({
      where: { id: id },
    });

    if (!found) {
      throw new NotFound("Fornecedor");
    }

    return found;
  },
  async update(id, dataToUpdate) {
    return await Model.update(dataToUpdate, {
      where: { id: id },
    });
  },
  async delete(id) {
    return await Model.destroy({
      where: { id: id },
    });
  },
};
