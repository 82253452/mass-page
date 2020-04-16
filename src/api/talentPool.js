import request from '@/utils/request'

const space = '/talent'

export function selectByPage(query) {
  return request({
    url: `${space}/page`,
    method: 'get',
    params: query
  })
}

export function updateById(data) {
  return request({
    url: `${space}`,
    method: 'put',
    data
  })
}

export function deleteById(id) {
  return request({
    url: `${space}/${id}`,
    method: 'delete'
  })
}

export function selectScs(i) {
  return request({
    url: `${space}/selectScs`,
    method: 'get'
  })
}

export function selectEdus() {
  return request({
    url: `${space}/selectEdus`,
    method: 'get'
  })
}

export function selectMajors() {
  return request({
    url: `${space}/selectMajors`,
    method: 'get'
  })
}
