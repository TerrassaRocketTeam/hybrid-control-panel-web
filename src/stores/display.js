
import { PUSH_WINDOW_SIZE, UPDATE_DISPLAY_PARAM, CHANGE_TUTORIAL_STATE } from '../actions/display'

// Set default state
let height = 700
let width = 1200
if (typeof window !== 'undefined') {
  height = window.innerHeight
  width = window.innerWidth
}
const defaultState = {
  width,
  height,
  tutorial: false,
  internalMesh: {
    material: 'solid',
    visible: true,
  },
  externalMesh: {
    material: 'solid',
    visible: true,
  },
  fluidBoxMesh: {
    material: 'wireframe',
    visible: false,
  },
}

function newState (param, value, state) {
  const route = param.split('.')
  const newstate = {}
  newstate[route[0]] = Object.assign({}, state[route[0]])
  newstate[route[0]][route[1]] = value
  return newstate
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_TUTORIAL_STATE:
      return Object.assign({}, state, { tutorial: action.state })

    case UPDATE_DISPLAY_PARAM:
      return Object.assign({}, state, newState(action.param, action.value, state))

    case PUSH_WINDOW_SIZE:
      return Object.assign({}, state, {
        width: action.width,
        height: action.height,
      })

    default:
      return state
  }
}
