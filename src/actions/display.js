
// Action names
export const PUSH_WINDOW_SIZE = 'PUSH_WINDOW_SIZE'
export const UPDATE_DISPLAY_PARAM = 'UPDATE_DISPLAY_PARAM'
export const CHANGE_TUTORIAL_STATE = 'CHANGE_TUTORIAL_STATE'

// Actions creators

export function pushWindowSize (width, height) {
  return { type: PUSH_WINDOW_SIZE, width, height }
}

export function changeDisplayParameter (param, value) {
  return { type: UPDATE_DISPLAY_PARAM, param, value }
}

export function changeTutorialState (state) {
  return { type: CHANGE_TUTORIAL_STATE, state }
}
