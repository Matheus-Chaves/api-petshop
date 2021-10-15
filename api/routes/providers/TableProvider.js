const Model = require('./ModelProvider')

module.exports = {
  listar() {
    return Model.findAll()
  }
}