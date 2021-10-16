const tableModel = require("../routes/providers/ModelProvider")

tableModel
  .sync() //will create tables that do not exists. If you already have all the tables, it will not do anything
  .then(() => { console.log('Table created successfully') })
  .catch((err) => console.log(err))