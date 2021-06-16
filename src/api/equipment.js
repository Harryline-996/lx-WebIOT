import request from '@/utils/request'

export function getEquipmentInfo(params) {
  return request({
    url: '/vue-admin-template/equipment/info',
    method: 'get',
    params
  })
}
