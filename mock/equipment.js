const Mock = require('mockjs')

const data = Mock.mock({
  'items|20': [{
    id: 'device000@increment',
    'name': /[A-Z][A-Z][0-9]传感器/,
    info: 'Device Data @datetime',
    value: '@integer(0, 100)',
    alert: '@integer(0, 1)',
    'lng|120.6': 1.0,
    'lat|30.6': 1.1,
    timestamp: '@integer(1623763216206, 1723763216206)'
  }]
})

const trackData = Mock.mock({
  'points|10': [{
    'lng|120.6': 1.0,
    'lat|30.6': 1.1
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/equipment/info',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/equipment/track',
    type: 'get',
    response: config => {
      const points = trackData.points
      return {
        code: 20000,
        data: {
          points: points
        }
      }
    }
  },
  {
    url: '/vue-admin-template/equipment/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/equipment/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/equipment/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
