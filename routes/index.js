
'use strict' // eslint-disable-line strict

const express = require('express')
const reactRender = require('./middleware/react-render')

const router = express.Router() // eslint-disable-line new-cap
router.use(reactRender)

/*
 *    Loads main page
 */
router.get('/', (req, res) => {
  res.reactRender({
    lang: 'en-US',
    pageinfo: {
      title: 'Control Panel',
      name: 'TRT hybrid - Control Panel',
      description: 'Control an hybrid rocket',
      keywords: 'TRT, Terrassa Rocket Team, Rocket, Hybrid, Control Panel',
    },
    initial: {
      data: {
        airfoils: req.airfoils,
      },
    },
  })
})

module.exports = router
