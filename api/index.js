const express = require('express')
const app = express()
const config = require('config')

app.use(express.json())

const router = require('./routes/providers/index')
app.use('/api/providers', router)

app.listen(config.get('api.port'), () => console.log("http://localhost:3000"))