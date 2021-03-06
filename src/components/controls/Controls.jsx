
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Components
import Paper from 'material-ui/Paper'
import LaunchControls from './subgroups/LaunchControls'
import StatusControls from './subgroups/StatusControls'
import Gauge from './subgroups/Gauge'
import RaisedButton from 'material-ui/RaisedButton'

// Actions
import {
  loginUsingPassword, passwordChange, logout, getAvailablePorts, setSelectedPort,
} from '../../actions/state'

// Styles
import * as style from './Controls.style'

// Shapes

const propTypes = {
  height: React.PropTypes.number,
  login: React.PropTypes.object.isRequired,
  loginUsingPassword: React.PropTypes.func.isRequired,
  passwordChange: React.PropTypes.func.isRequired,
  logout: React.PropTypes.func.isRequired,
  getAvailablePorts: React.PropTypes.func.isRequired,
  availablePorts: React.PropTypes.array.isRequired,
  setSelectedPort: React.PropTypes.func.isRequired,
  selectedPort: React.PropTypes.string,
  handleConnectionStart: React.PropTypes.func.isRequired,
  handleDisconnectSerial: React.PropTypes.func.isRequired,
  remote: React.PropTypes.object.isRequired,
  handleIgnitorCheck: React.PropTypes.func.isRequired,
  lastData: React.PropTypes.array.isRequired,
  handleLaunch: React.PropTypes.func.isRequired,
  handleAbortLaunch: React.PropTypes.func.isRequired,
  contrlDown: React.PropTypes.bool.isRequired,
  handleTare: React.PropTypes.func.isRequired,
  handleOpenValve: React.PropTypes.func.isRequired,
  handleCloseValve: React.PropTypes.func.isRequired,
}

function mapStateToProps (state) { // eslint-disable-line no-unused-vars
  return {
    height: state.display.height,
    login: state.state.login,
    availablePorts: state.state.availablePorts,
    selectedPort: state.state.selectedPort,
    remote: state.state.remote,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loginUsingPassword: bindActionCreators(loginUsingPassword, dispatch),
    passwordChange: bindActionCreators(passwordChange, dispatch),
    logout: bindActionCreators(logout, dispatch),
    getAvailablePorts: bindActionCreators(getAvailablePorts, dispatch),
    setSelectedPort: bindActionCreators(setSelectedPort, dispatch),
  }
}

class Controls extends React.Component {
  constructor (props) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handlePassChange = this.handlePassChange.bind(this)
    this.handleComDialogClose = this.handleComDialogClose.bind(this)
    this.handleComDialogOpen = this.handleComDialogOpen.bind(this)
    this.handleConnectionStart = this.handleConnectionStart.bind(this)

    this.state = {
      isSelectComDialogOpen: false,
    }
  }

  handleLogin () {
    if (this.props.login.success) {
      this.props.logout()
    } else {
      this.props.loginUsingPassword(this.props.login.current)
    }
  }

  handlePassChange (e) {
    this.props.passwordChange(e.target.value)
  }

  handleComDialogClose () {
    this.setState({
      isSelectComDialogOpen: false,
    })
  }

  handleConnectionStart () {
    this.props.handleConnectionStart(this.props.selectedPort)
    this.handleComDialogClose()
  }

  handleComDialogOpen () {
    this.props.getAvailablePorts()
    this.setState({
      isSelectComDialogOpen: true,
    })
  }

  render () {
    return (
      <div
        ref="scrollContainer"
        style={style.scrollContainer(this.props.height)}
      >
        <Paper style={style.container}>
          <div style={style.horitzontalContainer}>
            <div style={style.column}>
              {(() => {
                if (process.env.disableLoadGauge === false) {
                  return (
                    <div>
                      <Gauge
                        value={(this.props.lastData || [0, 0, 0, 0])[3]}
                        title="Load"
                        units="N"
                        min={0}
                        max={250}
                      />
                      <RaisedButton
                        secondary label={ 'Tare' }
                        style={{ marginBottom: 20 }}
                        onClick={this.props.handleTare}
                      />
                    </div>
                  )
                }
                return null
              })()}
            </div>
            <div style={Object.assign({}, style.column, { alignSelf: 'baseline' })}>
              <LaunchControls
                loginState={this.props.login}
                remote={this.props.remote}
                contrlDown={this.props.contrlDown}
                handleLaunch={this.props.handleLaunch}
                handleAbortLaunch={this.props.handleAbortLaunch}
                handleOpenValve={this.props.handleOpenValve}
                handleCloseValve={this.props.handleCloseValve}
              />
            </div>
            <div style={style.column} >
              {(() => {
                if (process.env.disablePressure1Gauge === false) {
                  return (
                    <Gauge
                      value={(this.props.lastData || [0, 0])[1]}
                      title="Pressure"
                      units="bar"
                      min={0}
                      max={100}
                    />
                  )
                }
                return null
              })()}
            </div>
            <div style={style.column}>
              {(() => {
                console.log('process.env.disablePressure2Gauge', process.env.disablePressure2Gauge)
                if (process.env.disablePressure2Gauge === false) {
                  return (
                    <Gauge
                      value={(this.props.lastData || [0, 0, 0])[2]}
                      title="Pressure"
                      units="bar"
                      min={0}
                      max={100}
                    />
                  )
                }
                return null
              })()}
            </div>
          </div>
          <div style={style.horitzontalContainer}>
            <StatusControls
              contrlDown={this.props.contrlDown}
              loginState={this.props.login}
              handleLogin={this.handleLogin}
              handlePassChange={this.handlePassChange}
              handleDialogClose={this.handleComDialogClose}
              handleConnectionStart={this.handleConnectionStart}
              handleDialogOpen={this.handleComDialogOpen}
              isSelectComDialogOpen={this.state.isSelectComDialogOpen}
              availablePorts={this.props.availablePorts}
              selectedPort={this.props.selectedPort}
              remote={this.props.remote}
              handleDisconnectSerial={this.props.handleDisconnectSerial}
              handleIgnitorCheck={this.props.handleIgnitorCheck}
            />
          </div>
        </Paper>
      </div>
    )
  }
}

Controls.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(Controls)
