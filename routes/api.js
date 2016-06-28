
'use strict' // eslint-disable-line strict

const express = require('express')
const serial = require('serialport')
const uuid = require('node-uuid')
const md5 = require('md5')
const conf = require('../conf')

const checkUser = require('./middleware/checkUser')

const router = express.Router() // eslint-disable-line new-cap
router.use(checkUser)

global.users = []
global.tokens = []

/*
 *    Returns the serialPorts available
 */
router.get('/serialPorts', (req, res) => {
  serial.list((err, ports) => {
    res.json(ports)
  })
})

/*
 *    Logs out a user
 */
router.delete('/user', (req, res) => {
  const user = req.loggedIn
  if (user.is) {
    global.users.splice(user.userIndex, 1)
    res.json({ msg: 'ok' })
  } else {
    res.status(400).json({ msg: 'no user' })
  }
})

/*
 *    Returns a token and logs the user
 */
router.post('/login', (req, res) => {
  const pass = req.body.pass
  const token = req.body.token

  const tokenI = global.tokens.findIndex((tk) => (tk.token === token))
  if (tokenI > -1) {
    global.tokens.splice(tokenI, 1)
    if (pass === md5(`${conf.pass}${token}`)) {
      const user = {
        type: 'logedin',
        logedinAt: new Date(),
        userAgent: req.headers['user-agent'],
        token: uuid.v4(),
      }
      global.users.push(user)
      res.status(200).json(user)
    } else {
      res.status(401).json({ msg: 'Password invalid', error: '101' })
    }
  } else {
    res.status(401).json({ msg: 'Token invalid', error: '100' })
  }
})

/*
 *    Returns a token and logs the user
 */
router.get('/token', (req, res) => {
  const token = {
    type: 'none',
    token: uuid.v4(),
  }
  global.tokens.push(token)
  res.json(token)
})

module.exports = router
