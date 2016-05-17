
require('babel-polyfill')

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

// Libraries
import React from 'react'
import ReactDom from 'react-dom'
import configureStore from './root/configureStore' // Redux

// Components
import Root from './root'

window.startApp = () => {
  // Our state
  let savedSettings
  let initialState = window.__INITIAL_STATE__

  if (typeof localStorage !== 'undefined') {
    savedSettings = JSON.parse(localStorage.getItem('savedSettings'))
  }

  if (
    savedSettings &&
    savedSettings.version === process.env.version &&
    process.env.NODE_ENV !== 'development'
  ) {
    initialState = savedSettings
  } else if (window.location.hostname !== 'localhost') {
    initialState.display.tutorial = true
  }

  const store = configureStore(initialState)

  ReactDom.render(
    <Root store={store} userAgent={navigator.userAgent} />,
    document.getElementById('react-content')
  )
}
