const TableProvider = require('./TableProvider')
const InvalidField = require('../../errors/InvalidField')
const DataNotFound = require('../../errors/DataNotFound')

class Provider {
  constructor({ id, company, email, category, createdAt, updatedAt, version }) {
    this.id = id,
    this.company = company,
    this.email = email,
    this.category = category,
    this.createdAt = createdAt,
    this.updatedAt = updatedAt,
    this.version = version
  }

  async create() {
    this.validate()
    const result = await TableProvider.insert({
      company: this.company,
      email: this.email,
      category: this.category
    })
    this.id = result.id
    this.createdAt = result.createdAt
    this.updatedAt = result.updatedAt
    this.version = result.version
  }

  async load() {
    const found = await TableProvider.getById(this.id)
    this.company = found.company
    this.email = found.email
    this.category = found.category
    this.createdAt = found.createdAt
    this.updatedAt = found.updatedAt
    this.version = found.version
  }

  async update() {
    await TableProvider.getById(this.id)
    const fields = ['company', 'email', 'category']
    const dataToUpdate = {}

    fields.forEach((field) => {
      const value = this[field]
      if (typeof value === 'string' && value.length > 0) {
        dataToUpdate[field] = value
      }
    })

    if (Object.keys(dataToUpdate).length === 0) {
      throw new DataNotFound()
    }

    await TableProvider.update(this.id, dataToUpdate)
  }

  async delete() {
    await TableProvider.getById(this.id)
    await TableProvider.delete(this.id)
  }

  validate() {
    const fields = ['company', 'email', 'category']

    fields.forEach(field => {
      const value = this[field] //'this' aqui se refere à instância, com isso nós pegamos o valor de forma dinâmica.

      if (typeof value !== 'string' || value.length === 0) {
        throw new InvalidField(field)
      }
    })
  }
}

module.exports = Provider