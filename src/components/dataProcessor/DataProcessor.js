
import io from 'socket.io-client'

class DataProcessor {
  constructor (handler, handleNewData) {
    this.handler = handler
    this.handleNewData = handleNewData

    this.ws = io.connect(location.origin)

    // Start the connection when ready
    this.ws.on('status', (data) => {
      this.handler('connectionStatus', data.connected)
      this.handler('ignitorChecked', data.ignitorChecked)
      this.handler('launching', data.launching)
      this.handler('timer', data.timer)
    })

    // Listner for timer changes
    this.ws.on('timer', (timer) => {
      this.handler('timer', timer)
    })

    // Listen for data
    this.ws.on('serialData', (data) => {
      this.handleNewData(data)
    })

    // Listen for errors
    this.ws.on('appError', (data) => {
      alert(data.msg) // eslint-disable-line
    })

    this.connect = this.connect.bind(this)
    this.disconnect = this.disconnect.bind(this)
  }

  connect (comPort, user) {
    this.ws.emit('connectSerial', { comPort, user })
  }

  disconnect (user) {
    this.ws.emit('disconnectSerial', { user })
  }

  checkIgnitor (user) {
    this.ws.emit('checkIgnitor', { user })
  }

  launch (user) {
    this.ws.emit('launch', { user })
  }

  abortLaunch (user) {
    this.ws.emit('abortLaunch', { user })
  }
}

export default DataProcessor
