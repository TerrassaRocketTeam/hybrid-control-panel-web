
'use strict' // eslint-disable-line

const SerialDataProcess = require('./serialDataProcess')
const checkUser = require('./checkUser')

module.exports = (io) => {
  let sdp
  let lastSendTime = Math.floor((new Date()) / 100)
  let lastData = []
  let launching = false
  let timer = -5
  let timerObj

  function emitStatus (socket) {
    (socket || io).emit('status',
      {
        connected: !!sdp && sdp.isOpen(),
        ignitorChecked: sdp && sdp.ignitorChecked,
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
          }
        )

        sdp.onData = (err, newData) => {
          lastData.push(newData)

          if (lastSendTime !== Math.floor((new Date()) / 100)) {
            lastSendTime = Math.floor((new Date()) / 100)
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
            sdp.activateDigitalOut(2)
          } else {
            sdp.deactivateDigitalOut(2)
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
        sdp.deactivateDigitalOut(2)

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
        
      } else {
        socket.emit('appError', { msg: 'Not authorized' })
      }
    })

    socket.on('closeValve', (data) => {
      if (checkUser(data.user).is) {
        
      } else {
        socket.emit('appError', { msg: 'Not authorized' })
      }
    })

    socket.on('checkIgnitor', (data) => {
      if (checkUser(data.user).is) {
        sdp.activateDigitalOut(1)
        setTimeout(() => {
          sdp.deactivateDigitalOut(1)
        }, 3000)
      } else {
        socket.emit('appError', { msg: 'Not authorized' })
      }
    })
  })
}
