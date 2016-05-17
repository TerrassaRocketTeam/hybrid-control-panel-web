
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Components
import Paper from 'material-ui/Paper'
import LaunchControls from './subgroups/LaunchControls'
import StatusControls from './subgroups/StatusControls'
import Gauge from './subgroups/Gauge'

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
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)

    this.state = {
      isSelectComDialogOpen: false,
      contrlDown: false,
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
  }

  handleKeyDown (e) {
    if (e.keyCode === 17) {
      this.setState({
        contrlDown: true,
      })
    }
  }

  handleKeyUp (e) {
    if (e.keyCode === 17) {
      this.setState({
        contrlDown: false,
      })
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
              <Gauge
                value={(this.props.lastData || [0, 0])[1]}
                title="Load"
                units="N"
                min={0}
                max={250}
              />
            </div>
            <div style={style.column}>
              <LaunchControls
                loginState={this.props.login}
                remote={this.props.remote}
                contrlDown={this.state.contrlDown}
                handleLaunch={this.props.handleLaunch}
                handleAbortLaunch={this.props.handleAbortLaunch}
              />
            </div>
            <div style={style.column}>
              <Gauge
                value={(this.props.lastData || [0, 0, 0])[2]}
                title="Pressure"
                units="bar"
                min={0}
                max={100}
              />
            </div>
            <div style={style.column}>
              <StatusControls
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
          </div>
          <div style={style.horitzontalContainer}>
            <div></div>
          </div>
        </Paper>
      </div>
    )
  }
}

Controls.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(Controls)
