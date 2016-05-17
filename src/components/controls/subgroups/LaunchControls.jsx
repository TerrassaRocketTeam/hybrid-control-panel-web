
import React from 'react'

// Components
import RaisedButton from 'material-ui/RaisedButton'

// Styles
import * as style from '../Controls.style'
import * as thisStyle from './LaunchControls.style'

// Shapes

const propTypes = {
  loginState: React.PropTypes.object.isRequired,
  remote: React.PropTypes.object.isRequired,
  contrlDown: React.PropTypes.bool.isRequired,
  handleLaunch: React.PropTypes.func.isRequired,
  handleAbortLaunch: React.PropTypes.func.isRequired,
}

function LaunchControls ({ loginState, remote, contrlDown, handleLaunch, handleAbortLaunch }) {
  return (
    <div>
      <h2 style={thisStyle.time}>Time</h2>
      <div style={thisStyle.timer}>
        T {remote.timer < 0 ? '-' : ''}
        {Math.floor(Math.abs(remote.timer / 60))}:{Math.abs(remote.timer % 60)}
      </div>
      <div style={Object.assign({}, thisStyle.btn, thisStyle.topBtn)}>
        <RaisedButton
          primary
          disabled={!(loginState.success && remote.connectionStatus && contrlDown)}
          label="Open Valve"
          style={style.btn}
        />
      </div>
      <div style={thisStyle.btn}>
        <RaisedButton
          primary
          disabled={
            !(loginState.success && remote.connectionStatus && (contrlDown || remote.launching))
          }
          label={remote.launching ? 'Abort' : 'Launch'}
          style={style.btn}
          onClick={remote.launching ? handleAbortLaunch : handleLaunch}
        />
        <span style={thisStyle.comment}>
          {(() => {
            if (loginState.success && remote.connectionStatus && contrlDown) {
              return ''
            } else if (loginState.success && remote.connectionStatus) {
              return '(Keep control down)'
            } else if (loginState.success) {
              return '(Not connected)'
            }
            return '(Not authorized)'
          })()}
        </span>
      </div>
    </div>
  )
}

LaunchControls.propTypes = propTypes

export default LaunchControls
