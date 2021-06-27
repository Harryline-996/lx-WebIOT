const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const user = require('./server/router/user')
const Equipment = require('./server/router/equipment')

mongoose.connect('mongodb://localhost:27017/iotdb')

const app = express()
app.use(bodyParser.json())
app.use(express.static('dist'))
// app.use(bodyParser.urlencoded({ extended: true }))
app.use('/dev-api', user)
app.use('/dev-api', Equipment)

app.use('/', (req, res) => {
  res.send('Yo!')
})
app.listen(3000, () => {
  console.log('app listening on port 3000.')
})

module.exports = app
