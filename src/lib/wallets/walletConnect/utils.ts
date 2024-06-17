import type { JsonRpcRequest } from './types'

const getPayloadId = (): number => {
  const date = Date.now() * Math.pow(10, 3)
  const extra = Math.floor(Math.random() * Math.pow(10, 3))
  return date + extra
}

export const formatJsonRpcRequest = <T>(method: string, params: T): JsonRpcRequest<T> => {
  return {
    id: getPayloadId(),
    jsonrpc: '2.0',
    method,
    params
  }
}
