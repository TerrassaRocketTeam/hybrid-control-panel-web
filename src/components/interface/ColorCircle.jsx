
import React from 'react'

// Styles
import * as style from './ColorCircle.style'

const propTypes = {
  color: React.PropTypes.string,
}

function ColorCircle ({ color }) {
  return (
    <span style={
        Object.assign({}, style.circle, { backgroundColor: color || '#000' })
      }
    />
  )
}

ColorCircle.propTypes = propTypes

export default ColorCircle
