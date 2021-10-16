const Model = require('./ModelProvider')

module.exports = {
  list() {
    return Model.findAll()
  },
  insert(provider) {
    return Model.create(provider)
  },
  async getById(id) {
    const found = await Model.findOne({
      where: {
        id: id
      }
    })

    if (!found) {
      throw new Error('Fornecedor não encontrado!')
    }

    return found
  },
  async update(id, dataToUpdate) {
    return await Model.update(
      dataToUpdate,
      {
        where: { id: id }
      }
    )
  }
}