const router = require('express').Router()
const TableProvider = require('./TableProvider')

router.get('/', async (request, response) => {
  await TableProvider.listar().then((results) => {
    response.send(
      JSON.stringify(results)
    )
  }).catch((err) => console.log(err))
})

module.exports = router