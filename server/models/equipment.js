const mongoose = require('mongoose')

const equipmentSchema = mongoose.Schema({
  deviceId: { type: String, required: true },
  deviceName: String,
  lat: Number,
  lng: Number,
  value: Number,
  alert: Number,
  time: Number
})

const Equipment = module.exports = mongoose.model('Equipment', equipmentSchema)
