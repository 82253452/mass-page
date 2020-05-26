import request from '@/utils/request'

const space = '/we'

export function getAppInfo(appId) {
  return request.get(`${space}/getAppInfo/${appId}`)
}

export function sendMsg(appId) {
  return request.get(`${space}/sendMsg/${appId}`)
}

