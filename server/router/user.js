const express = require('express')
const router = express.Router()
const User = require('../models/user')

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

// 用户注册
router.post('/user/register', (req, res) => {
  const { username, email, password } = req.body
  User.find({ 'username': username }, (err, docs) => {
    if (err) {
      res.json(err)
    } else {
      if (docs.length !== 0) {
        res.json({ code: 60204, message: '该用户名已经被注册！' })
      } else {
        User.find({ 'email': email }, (e, d) => {
          if (e) {
            res.json(e)
          } else {
            if (d.length !== 0) {
              res.json({ code: 60204, message: '该邮箱已经被注册！' })
            } else {
              // 使用Movie model上的create方法储存数据
              User.create(req.body, (er, newUser) => {
                if (er) {
                  res.json(er)
                } else {
                  res.json({
                    code: 20000,
                    data: 'success'
                  })
                }
              })
            }
          }
        })
      }
    }
  })
})

// 用户登录
router.post('/user/login', (req, res) => {
  const { username, password } = req.body
  const token = tokens['admin']
  const Res = { code: 20000, data: token }
  User.find({ 'username': username, 'password': password }, (err, docs) => {
    if (err) {
      res.json(err)
    } else {
      if (docs.length !== 0) {
        res.json(Res)
      } else {
        res.json({ code: 60204, message: '账户或密码错误！' })
      }
    }
  })
})

// 获取用户信息
router.get('/user/info', (req, res) => {
  const { token } = req.query
  const info = users[token]

  // mock error
  if (!info) {
    res.json({
      code: 50008,
      message: 'Login failed, unable to get user details.'
    })
  }

  res.json({
    code: 20000,
    data: info
  })
})

// 用户登出
router.post('/user/logout', (req, res) => {
  res.json({
    code: 20000,
    data: 'success'
  })
})

module.exports = router
