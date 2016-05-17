
import { combineReducers } from 'redux'

// Reducers
import data from './data'
import display from './display'
import state from './state'

const reducer = combineReducers({
  data,
  display,
  state,
})

export default function (state2, action) {
  const newState = reducer(state2, action)

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('savedSettings', JSON.stringify(
      Object.assign({}, state2, { version: process.env.version })
    ))
  }

  return newState
}
