
import axios from 'axios'
import md5 from 'md5'

// Action names
export const SET_AVAILABLE_PORTS = 'SET_AVAILABLE_PORTS'
export const SET_SELECTED_PORT = 'SET_SELECTED_PORT'
export const LOGIN = 'LOGIN'
export const PASSWORD_CHANGE = 'PASSWORD_CHANGE'
export const REMOTE_STATE_CHANGE = 'REMOTE_STATE_CHANGE'

// Actions creators

export function handleStateChange (name, value) {
  return { type: REMOTE_STATE_CHANGE, name, value }
}

export function passwordChange (value) {
  return { type: PASSWORD_CHANGE, value }
}

export function logout () {
  return (dispatch, getState) => (
    axios.delete(`/api/user?user=${getState().state.login.user}`)
    .then(() => (
      dispatch({ type: LOGIN, success: false, user: undefined, msg: undefined })
    ))
    .catch(() => {
      dispatch({ type: LOGIN, success: false, user: undefined, msg: undefined })
    })
  )
}

export function login (success, user, msg) {
  return { type: LOGIN, success, user, msg }
}

export function loginUsingPassword (password) {
  return (dispatch) => (
    axios.get('/api/token')
    .then((res) => (
      res.data.token
    ))
    .then((token) => (
      axios.post('/api/login', {
        pass: md5(`${password}${token}`),
        token,
      })
    ))
    .then((res) => {
      if (res.status === 200 && res.data.token) {
        dispatch(login(true, res.data.token))
      } else {
        dispatch(login(false, undefined, res.data.msg))
      }
    })
    .catch((res) => {
      dispatch(login(false, undefined, res.data.msg || 'Unknown error'))
    })
  )
}

export function setSelectedPort (port) {
  return { type: SET_SELECTED_PORT, port }
}

export function setAvailablePorts (ports) {
  return { type: SET_AVAILABLE_PORTS, ports }
}

export function getAvailablePorts () {
  return (dispatch) => (
    axios.get('/api/serialPorts')
    .then((res) => {
      dispatch(setAvailablePorts(res.data))
    }, (res) => {
      dispatch(setAvailablePorts([{ error: res.statusText, comName: 'error' }]))
    })
  )
}
