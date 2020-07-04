import { Bearer, generateBearer } from './bearers/'

type RpcConnection = {
  resolve: (args: any) => void
}

type RpcResult = {}

export class JsonRpc {
  private static VERSION = '2.0'

  private static connections: { [id: number]: RpcConnection } = {}
  private static id = 0

  private static webview: any

  bearer: Bearer

  private onExecute!: (method: string, params: any) => Promise<any>

  constructor(webview: any) {
    this.bearer = generateBearer(webview)
    this.bearer.onReceived(this.receive.bind(this))
  }

  async execute(method: string, params?: unknown) {
    // console.log("execute:", method, params)

    return new Promise(resolve => {
      const id = JsonRpc.id

      JsonRpc.connections[id] = { resolve }

      const message = {
        jsonrpc: JsonRpc.VERSION,
        method,
        params,
        id
      }
      this.bearer.send(message)

      JsonRpc.id++
    })
  }

  receive(message: any | string) {
    console.log('receive:', message)

    let data = message
    if (typeof message === 'string') {
      try {
        data = JSON.parse(message)
      } catch (e) {}
    }

    if (data.jsonrpc !== JsonRpc.VERSION) {
      return
    }

    if (data.method === 'ping') {
      this.receivePing(data)
      return
    }

    if (data.method) {
      this.receiveExecution(data)
    } else {
      this.receiveResult(data)
    }
  }

  private receivePing(data: any) {
    this.bearer.send({
      jsonrpc: JsonRpc.VERSION,
      result: 'pong',
      id: data.id
    })
  }

  private async receiveExecution(data: any) {
    // console.log("Execution:", data)

    if (typeof this.onExecute !== 'function') {
      return
    }

    const result = await this.onExecute(data.method, data.params)

    this.bearer.send({
      jsonrpc: JsonRpc.VERSION,
      result,
      id: data.id
    })
  }

  private receiveResult(data: any) {
    // console.log("Result:", data)

    const connection = JsonRpc.connections[data.id]
    if (!connection || !connection.resolve) {
      return
    }

    if (data.result || data.result === null) {
      connection.resolve(data.result)

      delete JsonRpc.connections[data.id]
    }
  }
}
