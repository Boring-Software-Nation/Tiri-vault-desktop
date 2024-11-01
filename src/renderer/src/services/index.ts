import { CONFIG } from '~/env'
import type { HttpResponse } from './api'
import { Api, ContentType } from './api'

export const limit = 10

console.log('CONFIG.API_HOST', CONFIG.API_HOST)

export const api = new Api({
  baseUrl: `${CONFIG.API_HOST}/api`,
  securityWorker: token => token ? { headers: { authorization: `Basic ${token}` } } : {},
  baseApiParams: {
    headers: {
      'content-type': ContentType.Json,
    },
    format: 'json',
  },
})

export function pageToOffset (page: number = 1, localLimit = limit): {limit: number, offset: number} {
  const offset = (page - 1) * localLimit
  return { limit: localLimit, offset }
}

export function isFetchError<E = object> (e: unknown): e is HttpResponse<unknown, E> {
  return e instanceof Object && 'error' in e
}
