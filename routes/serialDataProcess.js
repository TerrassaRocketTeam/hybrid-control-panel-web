
'use strict' // eslint-disable-line

const serialport = require('serialport')
const SerialPort = serialport.SerialPort

module.exports = function SerialDataProcess (comPort, errorCb, emitStatus) {
  /* Configuration */
  const gain = ['000', '000', '000', '000'] // Gain for each channel
  const pos = ['0000', '0001', '0010', '0011'] // Number of the channel
  const sampleRate = 10 // Hz per channel
  const ignitorTreshold = 1500
  /* Finish configuration */

  // Configuration derivate calculations
  const digitalChannel = pos.findIndex((item) => (item === '1000'))
  const resultLength = gain.length + (digitalChannel === -1 ? 0 : 3) + 1

  const digitalOut = [0, 0, 0, 0]

  this.s = new SerialPort(comPort, {
    baudRate: 9600,
    parity: 'none',
    bufferSize: 1024,
    parser: serialport.parsers.raw, // serialport.parsers.readline('\r'),
    stopBits: 1,
    dataBits: 8,
  })

  this.lastTime = 0
  this.data = []
  this.ignitorChecked = false

  this.initateSerialConnection = (err) => {
    if (err) {
      errorCb(err)
      return
    }

    this.s.write('bin\r') // Analog in 0, load cell

    this.s.write(`slist 0 ${parseInt(`00000${gain[0]}0000${pos[0]}`, 2)}\r`) // AI0, load cell
    this.s.write(`slist 1 ${parseInt(`00000${gain[1]}0000${pos[1]}`, 2)}\r`) // AI1, pressure 1
    this.s.write(`slist 2 ${parseInt(`00000${gain[2]}0000${pos[2]}`, 2)}\r`) // AI2, pressure 2
    this.s.write(`slist 3 ${parseInt(`00000${gain[3]}0000${pos[3]}`, 2)}\r`) // DI

    const SR = sampleRate * gain.length
    if (SR > 10000) {
      throw new Error('SampleRate to large')
    }
    const srate = Math.round(750000 / SR) // Given in the documentation
    this.s.write(`srate ${srate}\r`) // D

    this.s.write('start\r')

    emitStatus()
  }

  this.handleRecieveData = (data) => {
    const arr = new Uint8Array(data)

    let isFirstPart = undefined
    let previous
    let col
    const res = arr.reduce((final, item) => {
      const current = Math.floor(item / 2)
      if (item % 2 === 0) {
        // The last bit is 0 => Sync bit
        final.push([this.lastTime])
        this.lastTime += 1 / (sampleRate * pos.length)
        isFirstPart = true
        col = 1
      }
      if (isFirstPart === true) {
        previous = current
        isFirstPart = false
      } else if (isFirstPart === false) {
        if (col === digitalChannel + 1) {
          // Digital read
          final[final.length - 1][col] = previous % 2 // eslint-disable-line
          final[final.length - 1][col + 1] = Math.floor(previous / 2) % 2 // eslint-disable-line
          final[final.length - 1][col + 2] = Math.floor(previous / 4) % 2 // eslint-disable-line
          final[final.length - 1][col + 3] = Math.floor(previous / 8) % 2 // eslint-disable-line
          col += 3
        } else {
          // Analog reads
          if (current < 64) {
            // Numero positiu (bit mes significatiu es 0 [esta invertit])
            final[final.length - 1][col] = 128 * (current - 64) + previous // eslint-disable-line
          } else {
            // Numero negatiu (bit mes significatiu es 1 [esta invertit])
            final[final.length - 1][col] = 128 * (current + 64) + previous - 16383 // eslint-disable-line
          }
          if (Math.abs(final[final.length - 1][col]) > ignitorTreshold && !this.ignitorChecked) {
            this.ignitorChecked = true
            emitStatus()
          }
        }
        col++
        previous = undefined
        isFirstPart = true
      }

      return final
    }, [])
    .filter((item) => (item.length === resultLength))

    // Save the data
    this.data = this.data.concat(res)
    if (this.onData) {
      this.onData(undefined, res)
    }
  }

  this.stop = () => {
    this.s.write('stop\r')
    this.s.close()
  }

  this.updateDigitalOutState = () => {
    this.s.write(
      `D0${parseInt(digitalOut.reduce((all, item) => (all + item), ''), 2).toString(16)}\r`
    )
  }

  this.activateDigitalOut = (port) => {
    digitalOut[Math.abs(port - 3)] = 1
    this.updateDigitalOutState()
  }

  this.deactivateDigitalOut = (port) => {
    digitalOut[Math.abs(port - 3)] = 0
    this.updateDigitalOutState()
  }

  this.s.on('open', this.initateSerialConnection)

  this.s.on('data', this.handleRecieveData)

  this.isOpen = this.s.isOpen

  return this
}
