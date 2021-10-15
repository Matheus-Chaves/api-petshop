const tableModel = require("../routes/providers/ModelProvider")

tableModel
  .sync()
  .then(() => { console.log('Table created successfully') })
  .catch((err) => console.log(err))