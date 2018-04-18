import { WebSocket } from 'mel-core'
import SocketClient from 'socket.io-client'

export default class SocketIoWebSocket extends WebSocket {
  constructor (host, port) {
    super()
    this._host = host
    this._port = port
    console.log('Making connection ...')
    this._io = SocketClient(`http://${this._host}:${this._port}`)
  }

  emit (event, data) {
    return this._io.emit(event, data)
  }

  on (event, callback) {
    return this._io.on(event, callback)
  }
}
