const Sequelize = require('sequelize')
const instance = require('../../database')

const columns = {
  company: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.ENUM('ração', 'brinquedos'),
    allowNull: false
  },
}

const options = {
  freezeTableName: true,
  tableName: 'providers',
  timestamps: true,
  version: 'version'
  //createdAt: 'dataCriacao',     -> isso seria para renomear o nome padrão,
  //updatedAt: 'dataAtualizacao', -> em inglês, para o nome em português
}

module.exports = instance.define('providers', columns, options);