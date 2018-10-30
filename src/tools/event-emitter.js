export default class EventEmitter {
  constructor () {
    this.listeners = []
  }
  on (name, callback) {
    const listeners = this.listeners
    if (!listeners[name]) {
      listeners[name] = []
    }
    listeners[name].push(callback)
  }
  remove (name, listener) {
    const listeners = this.listeners
    if (!listeners[name]) {
      return
    }
    const index = listeners[name].indexOf(listener)
    listeners[name] = listeners[name].splice(index, 1)
  }
  invokeAll (name, data) {
    const listeners = this.listeners
    if (!listeners[name]) {
      return
    }
    listeners[name].forEach(listener => listener(data))
  }
}
