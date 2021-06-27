const express = require('express')
const router = express.Router()
const Equipment = require('../models/equipment')
const mongoose = require('mongoose')
const db = mongoose.connection

var count1 = 0
var count2 = 0
var count3 = 0
var count4 = 0

// 获取所有设备相关的统计数据
router.get('/equipment/statistics', (req, res) => {
  const timestamp = new Date().getTime()
  db.collection('equipments').find({}).toArray(function(err, result) {
    if (err) throw err
    count1 = result.length
  })
  db.collection('equipments').find({ 'alert': null }).toArray(function(err, result) {
    if (err) throw err
    count2 = count1 - result.length
  })
  db.collection('equipments').find({ 'alert': 1 }).toArray(function(err, result) {
    if (err) throw err
    count3 = result.length
  })
  db.collection('messages').find({}).toArray(function(err, result) {
    if (err) throw err
    count4 = result.length
  })
  res.json({
    code: 20000,
    data: {
      timestamp: timestamp,
      count1: count1,
      count2: count2,
      count3: count3,
      count4: count4
    }
  })
})

// 获取所有设备上传的数据
router.get('/equipment/message', (req, res) => {
  db.collection('messages').find({}).sort({ timestamp: -1 }).toArray(function(err, result) {
    if (err) throw err
    res.json({
      code: 20000,
      data: {
        total: result.length,
        items: result
      }
    })
  })
})

// 获取设备信息
router.get('/equipment/info', (req, res) => {
  db.collection('equipments').find({}).toArray(function(err, result) {
    if (err) throw err
    res.json({
      code: 20000,
      data: {
        total: result.length,
        items: result
      }
    })
  })
  // Equipment.find({})
  //   //   .then(equipments => {
  //   //     res.json({
  //   //       code: 20000,
  //   //       data: {
  //   //         total: equipments.length,
  //   //         items: equipments
  //   //       }
  //   //     })
  //   //   })
})

// 获取指定设备的轨迹
router.post('/equipment/track', (req, res) => {
  const { clientId } = req.body
  db.collection('messages').find({ 'clientId': clientId }, { projection: { 'lat': 1, 'lng': 1, '_id': 0 }}).limit(10).toArray(function(err, result) {
    if (err) throw err
    res.json({
      code: 20000,
      data: {
        total: result.length,
        items: result
      }
    })
  })
})

// 添加设备
router.post('/equipment/create', (req, res) => {
  const { deviceId, deviceName } = req.body
  const newDevice = { deviceId: deviceId, deviceName: deviceName }
  db.collection('equipments').insertOne(newDevice, function(err, result) {
    if (err) throw err
    res.json({
      code: 20000,
      data: 'success'
    })
  })
})

// 删除设备
router.post('/equipment/delete', (req, res) => {
  const { deviceId } = req.body
  db.collection('equipments').deleteOne({ 'deviceId': deviceId }, function(err, result) {
    if (err) throw err
    res.json({
      code: 20000,
      data: 'success'
    })
  })
})

// 更新设备
router.post('/equipment/update', (req, res) => {
  const { oldId, newId, newName } = req.body
  db.collection('equipments').updateOne({ 'deviceId': oldId }, { $set: { 'deviceId': newId, 'deviceName': newName }}, function(err, result) {
    if (err) throw err
    res.json({
      code: 20000,
      data: 'success'
    })
  })
})

module.exports = router
