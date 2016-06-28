
'use strict' // eslint-disable-line


// CONFIGURATION
// Port 0 and 3 do not work
const valveDigitalOut = 2 // 0
const continuityDigitalOut = 0 // 1 <-- this port does not work
const ignitorStartDigitalOut = 1 // 2

const updateTime = 200 // Time in milliseconds
// END CONFIGURATION

const SerialDataProcess = require('./serialDataProcess')
const checkUser = require('./checkUser')

module.exports = (io) => {
  let sdp
  let lastSendTime = Math.floor((new Date()) / 100)
  let lastData = []
  let launching = false
  let timer = -5
  let timerObj
  let valveOpened = false

  function emitStatus (socket) {
    (socket || io).emit('status',
      {
        connected: !!sdp && sdp.isOpen(),
        ignitorChecked: sdp && sdp.ignitorChecked,
        valveOpened,
        launching,
        timer,
      }
    )
  }

  // Sockets
  io.on('connection', (socket) => {
    emitStatus(socket)

    socket.on('connectSerial', (data) => {
      if (checkUser(data.user).is && !sdp && data.comPort) {
        sdp = new SerialDataProcess(
          data.comPort,
          {
            errorCb: () => {
              emitStatus(io)
              socket.emit('appError', { msg: 'Connection failed' })
            },
            emitStatus,
            writeToFile: `data${(new Date()).toISOString()}.dat`,
            checkLaunching: () => (launching),
          }
        )

        sdp.onData = (err, newData) => {
          lastData.push(newData)

          if (lastSendTime !== Math.floor((new Date()) / updateTime)) {
            lastSendTime = Math.floor((new Date()) / updateTime)
            io.emit('serialData',
              lastData
              .reduce(
                (all, item) => (
                  all.map((it, i) => (it + item[i]))
                )
              , [0, 0, 0, 0, 0, 0, 0, 0, 0])
              .map((item) => (item / lastData.length))
            )
            lastData = []
          }
        }
      } else if (!data.comPort) {
        socket.emit('appError', { msg: 'No comPort provided' })
      } else if (sdp) {
        socket.emit('appError', { msg: 'Connection is already on' })
      } else {
        socket.emit('appError', { msg: 'Not authorized' })
      }
    })

    socket.on('disconnectSerial', (data) => {
      if (checkUser(data.user).is && !!sdp) {
        sdp.stop()
        sdp = undefined

        emitStatus(io)
      } else if (!sdp) {
        socket.emit('appError', { msg: 'Connection is already off' })
      } else {
        socket.emit('appError', { msg: 'Not authorized' })
      }
    })

    socket.on('launch', (data) => {
      if (checkUser(data.user).is && !launching) {
        launching = true
        timer = -5
        io.emit('timer', timer)

        timerObj = setInterval(() => {
          timer++
          if (timer >= 0 && timer < 4) {
            sdp.activateDigitalOut(ignitorStartDigitalOut)
          } else {
            sdp.deactivateDigitalOut(ignitorStartDigitalOut)
          }
          io.emit('timer', timer)
        }, 1000)

        emitStatus(io)
      } else if (launching) {
        socket.emit('appError', { msg: 'Already lauching' })
      } else {
        socket.emit('appError', { msg: 'Not authorized' })
      }
    })

    socket.on('abortLaunch', (data) => {
      if (checkUser(data.user).is && launching) {
        launching = false
        clearInterval(timerObj)
        sdp.deactivateDigitalOut(ignitorStartDigitalOut)

        emitStatus(io)
      } else if (!launching) {
        socket.emit('appError', { msg: 'Not lauching' })
      } else {
        socket.emit('appError', { msg: 'Not authorized' })
      }
    })

    socket.on('tare', (data) => {
      if (checkUser(data.user).is && sdp) {
        sdp.handleTare(data.port)
      } else if (!sdp) {
        socket.emit('appError', { msg: 'Not connected' })
      } else {
        socket.emit('appError', { msg: 'Not authorized' })
      }
    })

    socket.on('openValve', (data) => {
      if (checkUser(data.user).is) {
        sdp.activateDigitalOut(valveDigitalOut)
        setTimeout(() => {
          sdp.deactivateDigitalOut(valveDigitalOut)
          valveOpened = false
          emitStatus(io)
        }, 2000)
        valveOpened = true
        emitStatus(io)
      } else {
        socket.emit('appError', { msg: 'Not authorized' })
      }
    })

    socket.on('closeValve', (data) => {
      if (checkUser(data.user).is) {
        sdp.deactivateDigitalOut(valveDigitalOut)
        emitStatus(io)
        valveOpened = false
      } else {
        socket.emit('appError', { msg: 'Not authorized' })
      }
    })

    // socket.on('checkIgnitor', (data) => {
    //   if (checkUser(data.user).is) {
    //     sdp.activateDigitalOut(continuityDigitalOut)
    //     setTimeout(() => {
    //       sdp.deactivateDigitalOut(continuityDigitalOut)
    //     }, 2000)
    //   } else {
    //     socket.emit('appError', { msg: 'Not authorized' })
    //   }
    // })
  })
}
