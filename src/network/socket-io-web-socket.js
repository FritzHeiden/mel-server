import { WebSocket } from 'mel-core'
import ServerSocket from 'socket.io'

export default class SocketIoWebSocket extends WebSocket {
  constructor (server) {
    super()
    this._server = server
  }

  initialize (path) {
    if (!this._server) {
      throw new Exception('Cannot initialize WebSocket: No server provided!')
    }
    this._io = new ServerSocket(this._server, { path })
    this._hasServer = true
  }

  on (event, callback) {
    return this._io.on(event, callback)
  }

  emit (event, data) {
    this._io.emit(event, data)
  }

  get id () {
    return this._io.id
  }
}
