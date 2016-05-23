
'use strict' // eslint-disable-line

const stream = require('stream')

module.exports = function DI155Parser (
  sampleRate, digitalChannel, ignitorTreshold, emitStatus, resultLength, gainRaw,
  ignitorChecked, checkIgnitor, lastTime, setLastTime
) {
  let time = lastTime
  const gain = gainRaw.map((g) => {
    switch (g) {
      case '000':
        return 1
      case '001':
        return 2
      case '010':
        return 4
      case '011':
        return 5
      case '100':
        return 8
      case '101':
        return 10
      case '110':
        return 16
      case '111':
        return 20
      default:
        return 1
    }
  })

  const parser = new stream.Transform({ objectMode: true })
  parser._transform = function praserFunction (chunk, encoding, done) {
    /*
      This function parses the binary data from the datalogger

      NOTE:
      this is bind to the parserFunction so it is keep between calls. We can make sure we don't
      break calls that way
    */

    const arr = new Uint8Array(chunk)

    arr.reduce((final, item) => {
      const current = Math.floor(item / 2)
      if (item % 2 === 0) {
        // The last bit is 0 => Sync bit
        if (this.elem) {
          final.push(this.elem)
        }
        this.elem = [time]
        time += 1 / (sampleRate * gain.length)
        setLastTime(time)
        this.isFirstPart = true
        this.col = 1
        this.input = 0
      }
      if (this.isFirstPart === true) {
        this.previous = current
        this.isFirstPart = false
      } else if (this.isFirstPart === false) {
        if (this.col === digitalChannel + 1) {
          // Digital read
          this.elem[this.col] = this.previous % 2 // eslint-disable-line
          this.elem[this.col + 1] = Math.floor(this.previous / 2) % 2 // eslint-disable-line
          this.elem[this.col + 2] = Math.floor(this.previous / 4) % 2 // eslint-disable-line
          this.elem[this.col + 3] = Math.floor(this.previous / 8) % 2 // eslint-disable-line
          this.col += 3
        } else {
          // Analog reads
          if (current < 64) {
            // Numero positiu (bit mes significatiu es 0 [esta invertit])
            this.elem[this.col] = 128 * (current - 64) + this.previous // eslint-disable-line
          } else {
            // Numero negatiu (bit mes significatiu es 1 [esta invertit])
            this.elem[this.col] = 128 * (current + 64) + this.previous - 16383 // eslint-disable-line
          }
          this.elem[this.col] = (50 / gain[this.input]) * (this.elem[this.col] / 8192)
          if (
            Math.abs(this.elem[this.col]) > ignitorTreshold &&
            !ignitorChecked &&
            this.col === 4
          ) {
            checkIgnitor(true)
            emitStatus()
          }
        }
        this.input++
        this.col++
        this.previous = undefined
        this.isFirstPart = true
      }

      return final
    }, [])
    .filter((item) => (item.length === resultLength))
    .forEach((item) => {this.push(item)})

    done()
  }

  return parser
}
