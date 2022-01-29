const Sequelize = require("sequelize");
const instance = require("../../../database");

const columns = {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  stock: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  provider: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: require("../ModelProvider"),
      key: "id",
    },
  },
};

const options = {
  freezeTableName: true,
  tableName: "products",
  timestamps: true,
  version: "version",
  //createdAt: 'dataCriacao',     -> isso seria para renomear o nome padrão,
  //updatedAt: 'dataAtualizacao', -> em inglês, para o nome em português
};

module.exports = instance.define("product", columns, options);
