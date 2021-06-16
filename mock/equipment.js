const Mock = require('mockjs')

const data = Mock.mock({
  'items|5': [{
    id: 'device000@increment',
    info: 'Device Data @datetime',
    value: '@integer(0, 100)',
    alert: '@integer(0, 1)',
    'lng|120.10': 1.0,
    'lat|30.10': 1.1,
    timestamp: '@integer(1623763216206, 1723763216206)'
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
  }
]
