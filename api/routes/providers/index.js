const router = require('express').Router()
const TableProvider = require('./TableProvider')
const Provider = require('./Provider')
const { response } = require('express')

router.get('/', async (request, response) => {
  await TableProvider.list().then((results) => {
    response.send(
      JSON.stringify(results)
    )
  }).catch((err) => {
    response.send(
      JSON.stringify({
        message: err.message
      })
    )
  })
})

router.post('/', async (request, response) => {
  const receivedData = request.body
  const provider = new Provider(receivedData)
  await provider.create().then(() => {
    response.send(
      JSON.stringify(provider)
    )
  }).catch((err) => {
    response.send(
      JSON.stringify({
        message: err.message
      })
    )
  })
})

router.get('/:idProvider', async (request, response) => {
  const id = request.params.idProvider
  const provider = new Provider({ id: id })
  await provider.load().then(() => {
    response.send(
      JSON.stringify(provider)
    )
  }).catch((err) => {
    response.send(
      JSON.stringify({
        message: err.message
      })
    )
  })
})

router.put('/:idProvider', async (request, response) => {
  const id = request.params.idProvider
  const receivedData = request.body
  //const data = Object.assign({}, receivedData, { id: id }) OR YOU CAN:
  const data = { ...receivedData, id }
  const provider = new Provider(data)
  await provider.update().then(() => {
    response.end()
  }).catch((err) => {
    response.send(
      JSON.stringify({
        message: err.message
      })
    )
  })
})

module.exports = router