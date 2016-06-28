
'use strict' // eslint-disable-line

module.exports = {
  // Datalogger configuration-----------------------------------------------------------------------
  // See the data datalogger documentation. Binnary data in strings is inputed.
  gain: ['100', '100', '011', '000'], // Gain for each channel
  pos: ['0000', '0001', '0010', '0011'], // Number of the channel
  sampleRate: 500, // Hz per channel
  // NOTE: Maximum Hz are 10000 / nChannels. Ergo, per 2 channels he max is 5000Hz.


  // Datalogger digital outs assignation------------------------------------------------------------
  valveDigitalOut: 2, // 0
  continuityDigitalOut: 0, // 1 <-- this function is disabled (now it's continous)
  ignitorStartDigitalOut: 1, // 2


  // Software confiburation-------------------------------------------------------------------------
  ignitorTreshold: 5, // Volts to assure the ignitor is working
  // (depends on the batteries and resistor used)


  // Update time of the client----------------------------------------------------------------------
  updateTime: 200, // Time in milliseconds


  // Client configurations--------------------------------------------------------------------------
  disablePressure1Gauge: false, // Does not display the gauge
  disablePressure2Gauge: false, // Does not display the gauge
  disableLoadGauge: false, // Does not display the gauge
  pass: 'previsió',
}
