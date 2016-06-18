
import React from 'react'

// Components
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import ColorCircle from '../../interface/ColorCircle'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

// Styles
import * as style from '../Controls.style'
import * as thisStyle from './StatusControls.style'

// Shapes

const propTypes = {
  loginState: React.PropTypes.object.isRequired,
  handleLogin: React.PropTypes.func.isRequired,
  handlePassChange: React.PropTypes.func.isRequired,
  handleDialogClose: React.PropTypes.func.isRequired,
  handleDialogOpen: React.PropTypes.func.isRequired,
  handleConnectionStart: React.PropTypes.func.isRequired,
  isSelectComDialogOpen: React.PropTypes.bool.isRequired,
  availablePorts: React.PropTypes.array.isRequired,
  selectedPort: React.PropTypes.string,
  remote: React.PropTypes.object,
  handleDisconnectSerial: React.PropTypes.func,
  handleIgnitorCheck: React.PropTypes.func,
  contrlDown: React.PropTypes.bool,
}

function LaunchControls ({
  loginState,
  handleLogin,
  handlePassChange,
  handleDialogClose,
  handleConnectionStart,
  handleDialogOpen,
  isSelectComDialogOpen,
  availablePorts,
  selectedPort,
  remote,
  handleDisconnectSerial,
  // handleIgnitorCheck,
  contrlDown,
}) {
  const actions = [
    <FlatButton
      label="Cancel"
      primary
      onTouchTap={handleDialogClose}
    />,
    <FlatButton
      label="Submit"
      primary
      keyboardFocused
      onTouchTap={handleConnectionStart}
    />,
  ]

  return (
    <div style={Object.assign({}, style.horitzontalContainer, { alignItems: 'top' })}>
      <div style={style.column}>
        <table style={thisStyle.table}>
          <tbody>
            <tr style={thisStyle.tableRow}>
              <td style={thisStyle.leftCol}>Datalogger connection</td>
              <td style={thisStyle.centerCol}>
                <ColorCircle color={
                  (() => {
                    if (remote.connectionStatus) {
                      return '#0f0'
                    }
                    return '#f00'
                  })()}
                />
              </td>
              <td style={thisStyle.rightCol}>
                { remote.connectionStatus ? 'Connected' : 'Not connected' }
                <button
                  primary
                  style={thisStyle.inlineBtn}
                  disabled={!(loginState.success && contrlDown)}
                  onClick={remote.connectionStatus ? // eslint-disable-line
                    (contrlDown ? handleDisconnectSerial : undefined)
                    : handleDialogOpen
                  }
                >
                  { remote.connectionStatus ? 'Disconnect' : 'Connect' }
                </button>
              </td>
            </tr>
            <tr style={thisStyle.tableRow}>
              <td style={thisStyle.leftCol}>Launcher Status</td>
              <td style={thisStyle.centerCol}><ColorCircle color="#f00" /></td>
              <td style={thisStyle.rightCol}>No Pressure</td>
            </tr>
            <tr style={thisStyle.tableRow}>
              <td style={thisStyle.leftCol}>Authoritzation status</td>
              <td style={thisStyle.centerCol}>
                <ColorCircle color={loginState.success ? '#0f0' : '#f00'} />
              </td>
              <td style={thisStyle.rightCol}>{
                loginState.success ? 'Authorized' : 'Not Authorized'
              }</td>
            </tr>
            <tr style={thisStyle.tableRow}>
              <td colSpan="2" style={thisStyle.leftCol}>
                <TextField
                  floatingLabelText="Password" type="password" style={{ width: 150 }}
                  onChange={handlePassChange}
                  errorText={loginState.msg}
                  value={loginState.current}
                  disabled={loginState.success}
                />
              </td>
              <td style={thisStyle.rightCol}>
                <RaisedButton
                  secondary label={loginState.success ? 'Revoke Auth' : 'Request Auth'}
                  style={{ marginTop: 20 }}
                  onClick={handleLogin}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={style.column}>
        <table style={thisStyle.table}>
          <tbody>
            <tr style={thisStyle.tableRow}>
              <td style={thisStyle.leftCol}>Pressure sensor 1</td>
              <td style={thisStyle.centerCol}><ColorCircle color="#ff0" /></td>
              <td style={thisStyle.rightCol}>Maybe works</td>
            </tr>
            <tr style={thisStyle.tableRow}>
              <td style={thisStyle.leftCol}>Pressure sensor 2</td>
              <td style={thisStyle.centerCol}><ColorCircle color="#ff0" /></td>
              <td style={thisStyle.rightCol}>Maybe works</td>
            </tr>
            <tr style={thisStyle.tableRow}>
              <td style={thisStyle.leftCol}>Electrovavle</td>
              <td style={thisStyle.centerCol}><ColorCircle color="#ff0" /></td>
              <td style={thisStyle.rightCol}>Maybe works</td>
            </tr>
            <tr style={thisStyle.tableRow}>
              <td style={thisStyle.leftCol}>Ignitor continuity</td>
              <td style={thisStyle.centerCol}>
                <ColorCircle color={remote.ignitorChecked ? '#0f0' : '#f00'} />
              </td>
              <td style={thisStyle.rightCol}>
                {remote.ignitorChecked ? 'Working' : 'Not working'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Dialog
        title="Select a COM port"
        actions={actions}
        modal={false}
        contentStyle={thisStyle.popup}
        open={isSelectComDialogOpen}
        onRequestClose={handleDialogClose}
      >
        <SelectField value={selectedPort}>
          {(availablePorts || []).reduce((all, item) => {
            if (item.error) {
              return (
                <MenuItem value="error" primaryText="Error loading" />
              )
            }
            if (item.manufacturer === 'DATAQ Instruments, Inc.') {
              all.push(
                <MenuItem value={item.comName} primaryText={item.comName} />
              )
            } else {
              all.push(
                <MenuItem disabled value={item.comName} primaryText={item.comName} />
              )
            }
            return all
          }, [])}
        </SelectField>
      </Dialog>
    </div>
  )
}

LaunchControls.propTypes = propTypes

export default LaunchControls
