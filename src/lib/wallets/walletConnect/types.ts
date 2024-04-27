// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface JsonRpcRequest<T = any> {
  id: number
  jsonrpc: string
  method: string
  params: T
}
