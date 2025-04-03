import { api } from '~/services'
import { userStorage } from '~/store/user'

export default function ( token?: string | null ): string | void {
  if (token === null) {
    api.setSecurityData(null)
    return
  } else if (token !== undefined) {
    // const token = btoa(`:${password}`)
    api.setSecurityData(token)
    return token
  }
  token = userStorage.get()?.token
  if (token !== undefined) api.setSecurityData(token)
}
