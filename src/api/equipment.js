import request from '@/utils/request'

export function getEquipmentStatistics(params) {
  return request({
    url: '/equipment/statistics',
    method: 'get',
    params
  })
}

export function getEquipmentMessage(params) {
  return request({
    url: '/equipment/message',
    method: 'get',
    params
  })
}

export function getEquipmentInfo(params) {
  return request({
    url: '/equipment/info',
    method: 'get',
    params
  })
}

export function getEquipmentTrack(data) {
  return request({
    url: '/equipment/track',
    method: 'post',
    data
  })
}

export function createEquipment(data) {
  return request({
    url: '/equipment/create',
    method: 'post',
    data
  })
}

export function deleteEquipment(data) {
  return request({
    url: '/equipment/delete',
    method: 'post',
    data
  })
}

export function updateEquipment(data) {
  return request({
    url: '/equipment/update',
    method: 'post',
    data
  })
}
