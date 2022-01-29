/* Agora, com mais de uma tabela, o código precisa mudar
  const tableModel = require("../routes/providers/ModelProvider")

  tableModel
    .sync() //will create tables that do not exists. If you already have all the tables, it will not do anything
    .then(() => { console.log('Table created successfully') })
    .catch((err) => console.log(err))
*/
const models = [
  require("../routes/providers/ModelProvider"),
  require("../routes/providers/products/ModelProducts"),
];

async function createTables() {
  for (let count = 0; count < models.length; count++) {
    const model = models[count];
    await model.sync(); //sincroniza configuração do modelo atual com nosso banco de dados
  }
}

createTables();
