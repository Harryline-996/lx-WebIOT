import request from '@/utils/request'

export function getEquipmentInfo(params) {
  return request({
    url: '/vue-admin-template/equipment/info',
    method: 'get',
    params
  })
}

export function getEquipmentTrack(params) {
  return request({
    url: '/vue-admin-template/equipment/track',
    method: 'get',
    params
  })
}

export function createEquipment(data) {
  return request({
    url: '/vue-admin-template/equipment/create',
    method: 'post',
    data
  })
}

export function deleteEquipment(data) {
  return request({
    url: '/vue-admin-template/equipment/delete',
    method: 'post',
    data
  })
}

export function updateEquipment(oldData, data) {
  return request({
    url: '/vue-admin-template/equipment/update',
    method: 'post',
    oldData,
    data
  })
}
