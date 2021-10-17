const router = require('express').Router()
const TableProvider = require('./TableProvider')
const Provider = require('./Provider')

router.get('/', async (request, response) => {
  await TableProvider.list().then((results) => {
    response.status(200).send( //não necessário utilizar status 200, pois, por padrão, ja retorna 200
      JSON.stringify(results)
    )
  })
})

router.post('/', async (request, response) => {
  const receivedData = request.body
  const provider = new Provider(receivedData)
  await provider.create().then(() => {
    response.status(201).send(
      JSON.stringify(provider)
    )
  }).catch((err) => {
    response.status(400).send(
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
    response.status(200).send(
      JSON.stringify(provider)
    )
  }).catch((err) => {
    response.status(404).send(
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
    response.status(204)
    response.end(/*`Fornecedor com id ${id} atualizado com sucesso.`*/) //com status = 204, a mensagem não é recebida
  }).catch((err) => {
    response.status(400).send(
      JSON.stringify({
        message: err.message
      })
    )
  })
})

router.delete('/:idProvider', async (request, response) => {
  const id = request.params.idProvider
  const provider = new Provider({ id: id })
  await provider.delete().then(() => {
    response.status(204).end()
  }).catch((err) => {
    response.status(404).send(
      JSON.stringify({
        message: err.message
      })
    )
  })
})
module.exports = router