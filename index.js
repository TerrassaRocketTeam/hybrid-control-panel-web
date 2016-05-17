
'use strict' // eslint-disable-line strict

// Libraries
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const exphbs = require('express-handlebars')
const express = require('express')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const path = require('path')

// Routes
const home = require(path.join(__dirname, 'routes/index'))
const api = require(path.join(__dirname, 'routes/api'))

const app = express()
const server = require('http').Server(app) // eslint-disable-line
const io = require('socket.io')(server)

require('./routes/ws.js')(io)

// Express configuration
app.use(compression())
app.enable('trust proxy')
app.set('views', path.join(__dirname, '/views'))
app.engine('handlebars', exphbs({}))
app.set('view engine', 'handlebars')
app.set('port', (process.env.PORT || 5000))
// app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')))
app.use(cookieParser())
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  // Production
  app.use(logger('common'))
} else {
  app.use(logger('dev'))
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Loads the app
app.use('/', home)

// Loads the app
app.use('/api', api)

// Loads public folder
app.use(express.static(path.join(__dirname, 'public')))

/*
 *  Respon a les 404
 */
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Pàgina innexistent',
    subtitle: 'Em sap greu, la pàgina que estas intentant veure no existeix.',
  })
})

// error handlers
app.use((err, req, res) => {
  res.status(err.status || 500)
  res.send(`error: ${err.message} ${err}`)
})

server.listen(app.get('port'), () => {
  console.log(`Node app is running at localhost: ${app.get('port')}`) // eslint-disable-line
})

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0)
  })
})
