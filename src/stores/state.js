
import {
  SET_AVAILABLE_PORTS, LOGIN, PASSWORD_CHANGE, SET_SELECTED_PORT, REMOTE_STATE_CHANGE,
} from '../actions/state'

// Set default state
const defaultState = {
  availablePorts: [],
  selectedPort: undefined,
  login: {
    success: false,
    user: undefined,
    msg: undefined,
    current: '',
  },
  remote: {
    connectionStatus: false,
    lastData: undefined,
    ignitorChecked: false,
    valveOpened: false,
    launching: false,
    timer: -10,
  },
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case REMOTE_STATE_CHANGE: // eslint-disable-line
      const aux = {}
      aux[action.name] = action.value
      return Object.assign({}, state, { remote: Object.assign({}, state.remote, aux) })

    case SET_SELECTED_PORT:
      return Object.assign({}, state, { selectedPort: action.port })

    case SET_AVAILABLE_PORTS:
      return Object.assign({}, state, {
        availablePorts: [...action.ports],
        selectedPort: (action.ports[0] || {}).comName,
      })

    case PASSWORD_CHANGE:
      return Object.assign({}, state, { login: {
        success: state.login.success,
        user: state.login.user,
        msg: state.login.msg,
        current: action.value,
      } })

    case LOGIN:
      return Object.assign({}, state, { login: {
        success: action.success,
        user: action.user,
        msg: action.msg,
        current: state.login.current,
      } })

    default:
      return state
  }
}
