
import { PropTypes } from 'react'

export default PropTypes.shape({
  width: PropTypes.number,
  height: PropTypes.number,
  internalMesh: {
    material: PropTypes.string.isRequired,
    visible: PropTypes.bool,
  },
  externalMesh: {
    material: PropTypes.string.isRequired,
    visible: PropTypes.bool,
  },
})
