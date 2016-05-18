
'use strict' // eslint-disable-line

const stream = require('stream')
const fs = require('fs')
const serialport = require('serialport')
const SerialPort = serialport.SerialPort
const dI155parser = require('./DI155parser')

module.exports = function SerialDataProcess (comPort, options) {
  const errorCb = options.errorCb
  const emitStatus = options.emitStatus
  const writeToFile = options.writeToFile

  /* Configuration */
  const gain = ['000', '000', '000', '000'] // Gain for each channel
  const pos = ['0000', '0001', '0010', '0011'] // Number of the channel
  const sampleRate = 10 // Hz per channel
  const ignitorTreshold = 1500
  /* Finish configuration */

  // Configuration derivate calculations
  const digitalChannel = pos.findIndex((item) => (item === '1000'))
  const resultLength = gain.length + (digitalChannel === -1 ? 0 : 3) + 1
  // Done with derivate chalculations

  this.lastTime = 0
  this.data = []
  this.ignitorChecked = false

  const self = this

  const checkIgnitor = (val) => { this.ignitorChecked = val }
  const setLastTime = (val) => { this.lastTime = val }

  const dparser = dI155parser(
    sampleRate, digitalChannel, ignitorTreshold, emitStatus, resultLength, pos,
    this.ignitorChecked, checkIgnitor, this.lastTime, setLastTime
  )

  const digitalOut = [0, 0, 0, 0]

  this.s = new SerialPort(comPort, {
    baudRate: 9600,
    parity: 'none',
    bufferSize: 1024,
    parser: serialport.parsers.raw, // serialport.parsers.readline('\r'),
    stopBits: 1,
    dataBits: 8,
  })

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

  // This transform sends the data to the callback, then we continue the pipe to save it to the file
  const sender = new stream.Transform({ objectMode: true })
  sender._transform = function senderFunction (chunk, encoding, done) {
    // Save the data
    self.data.push(chunk)
    if (self.onData) {
      self.onData(undefined, chunk)
    }

    this.push(`${chunk.join('\t')}\n`)
    done()
  }

  const writeStream = fs.createWriteStream(
    `${__dirname}/../data/${writeToFile.replace('.', '-').replace(':', '-').replace(':', '-')}`
  )

  let counter = 0
  const checkIfReadyToStart = () => {
    counter++
    if (counter === 2) {
      this.s.pipe(dparser)
      dparser.pipe(sender)
      sender.pipe(writeStream)
      this.initateSerialConnection()
    }
  }

  writeStream.on('open', checkIfReadyToStart)
  this.s.on('open', checkIfReadyToStart)

  this.isOpen = this.s.isOpen

  return this
}
