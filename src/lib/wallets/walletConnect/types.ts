export interface JsonRpcRequest<T> {
  id: number
  jsonrpc: string
  method: string
  params: T
}
