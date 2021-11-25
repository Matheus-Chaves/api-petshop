const router = require('express').Router()
const TableProvider = require('./TableProvider')
const Provider = require('./Provider')
const SerializerProvider = require('../../Serializer').SerializerProvider

router.get('/', async (request, response) => {
  await TableProvider.list().then((results) => {
    const serializer = new SerializerProvider(
      response.getHeader('Content-Type') //pegando o tipo de conteúdo do cabeçalho (definido no middleware na raiz da api)
    )
    response.status(200).send( //não necessário utilizar status 200, pois, por padrão, ja retorna 200
      serializer.serialize(results) //serializa os resultados, convertendo-os em json
    )
  })
})

router.post('/', async (request, response, next) => {
  const receivedData = request.body
  const provider = new Provider(receivedData)
  await provider.create().then(() => {
    const serializer = new SerializerProvider(
      response.getHeader('Content-Type')
    )
    response.status(201).send(
      serializer.serialize(provider)
    )
  }).catch((err) => {
    next(err)
  })
})

router.get('/:idProvider', async (request, response, next) => {
  const id = request.params.idProvider
  const provider = new Provider({ id: id })
  await provider.load().then(() => {
    const serializer = new SerializerProvider(
      response.getHeader('Content-Type'),
      ['email', 'createdAt', 'updatedAt', 'version']
    )
    response.status(200).send(
      serializer.serialize(provider)
    )
  }).catch((err) => {
    next(err)
  })
})

router.put('/:idProvider', async (request, response, next) => { //"next" recebe a função do middleware localizado na raiz (index.js) do projeto
  const id = request.params.idProvider
  const receivedData = request.body
  //const data = Object.assign({}, receivedData, { id: id }) OR YOU CAN:
  const data = { ...receivedData, id }
  const provider = new Provider(data)
  await provider.update().then(() => {
    response.status(204)
    response.end(/*`Fornecedor com id ${id} atualizado com sucesso.`*/) //com status = 204, a mensagem não é recebida
  }).catch((err) => {
    next(err)
  })
})

router.delete('/:idProvider', async (request, response, next) => {
  const id = request.params.idProvider
  const provider = new Provider({ id: id })
  await provider.delete().then(() => {
    response.status(204).end()
  }).catch((err) => {
    next(err)
  })
})
module.exports = router