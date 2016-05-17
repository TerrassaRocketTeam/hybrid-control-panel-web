
// Action names
export const REPLACE_AIRFOILS = 'REPLACE_AIRFOILS'

// Actions creators

export function replaceAirfoils (airfoils) {
  return { type: REPLACE_AIRFOILS, airfoils }
}
