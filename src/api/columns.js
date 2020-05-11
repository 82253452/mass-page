import request from '@/utils/request'

const space = '/columns'

export async function selectByPage(params) {
  return request.get(space, { params })
}

export async function selectAll() {
  return request.get(`${space}/all`)
}

export async function insert(data) {
  return request.post(space, data)
}

export async function selectById(id) {
  return request.get(`${space}/${id}`)
}

export async function updateById(data) {
  return request.put(space, data)
}

export async function deleteById(id) {
  return request.delete(`${space}/${id}`)
}
