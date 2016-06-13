
require('perfnow') // Polyfill performane.now

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import DataProcessor from './dataProcessor/DataProcessor'

// Components
import AppBar from './interface/AppBar'
import Controls from './controls/Controls'
import Container from './container'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import LockIcon from 'material-ui/svg-icons/action/lock'
import UnLockIcon from 'material-ui/svg-icons/action/lock-open'

// Actions
import { handleStateChange } from '../actions/state'

// Sytles
import * as style from './app.style.js'

const propTypes = {
  replaceAirfoils: React.PropTypes.func,
  changeTutorialState: React.PropTypes.func,
  handleStateChange: React.PropTypes.func,
  user: React.PropTypes.string,
}

function mapStateToProps (state) {
  return {
    user: state.state.login.user,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleStateChange: bindActionCreators(handleStateChange, dispatch),
  }
}

class App extends React.Component {
  constructor (props) {
    super(props)

    this.handleConnectionStart = this.handleConnectionStart.bind(this)
    this.handleDisconnectSerial = this.handleDisconnectSerial.bind(this)
    this.handleIgnitorCheck = this.handleIgnitorCheck.bind(this)
    this.handleNewData = this.handleNewData.bind(this)
    this.handleLaunch = this.handleLaunch.bind(this)
    this.handleAbortLaunch = this.handleAbortLaunch.bind(this)
    this.handleCntrlDown = this.handleCntrlDown.bind(this)
    this.handleCntrlUp = this.handleCntrlUp.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.handleTare = this.handleTare.bind(this)
    this.handleOpenValve = this.handleOpenValve.bind(this)
    this.handleCloseValve = this.handleCloseValve.bind(this)

    this.dp = new DataProcessor(this.props.handleStateChange, this.handleNewData)

    this.state = {
      lastData: [],
      contrlDown: false,
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleCntrlDown)
    document.addEventListener('keyup', this.handleCntrlUp)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleCntrlDown)
    document.removeEventListener('keyup', this.handleCntrlUp)
  }

  handleNewData (data) {
    this.setState({
      lastData: data,
    })
  }

  handleCntrlDown (e) {
    if (e.keyCode === 17 || typeof e.clientX !== 'undefined') {
      this.setState({
        contrlDown: true,
      })
    }
  }

  handleCntrlUp (e) {
    if (e.keyCode === 17 || typeof e.clientX !== 'undefined') {
      this.setState({
        contrlDown: false,
      })
    }
  }

  handleConnectionStart (comPort) {
    this.dp.connect(comPort, this.props.user)
  }

  handleDisconnectSerial () {
    this.dp.disconnect(this.props.user)
  }

  handleIgnitorCheck () {
    this.props.handleStateChange('ignitorChecked', undefined)
    this.dp.checkIgnitor(this.props.user)
  }

  handleLaunch () {
    this.dp.launch(this.props.user)
  }

  handleAbortLaunch () {
    this.dp.abortLaunch(this.props.user)
  }

  handleTare () {
    this.dp.tare(this.props.user, 3)
  }

  handleOpenValve () {
    this.dp.openValve(this.props.user)
  }

  handleCloseValve () {
    this.dp.closeValve(this.props.user)
  }

  render () {
    return (
      <Container>
        <AppBar />
        <Controls
          handleConnectionStart={this.handleConnectionStart}
          handleDisconnectSerial={this.handleDisconnectSerial}
          handleIgnitorCheck={this.handleIgnitorCheck}
          lastData={this.state.lastData}
          handleLaunch={this.handleLaunch}
          handleAbortLaunch={this.handleAbortLaunch}
          contrlDown={this.state.contrlDown}
          handleTare={this.handleTare}
          handleOpenValve={this.handleOpenValve}
          handleCloseValve={this.handleCloseValve}
        />
        <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
          <div>
            <FloatingActionButton
              onClick={this.state.contrlDown ? this.handleCntrlUp : this.handleCntrlDown}
            >
              {(() => {
                if (this.state.contrlDown) {
                  return <UnLockIcon />
                }
                return <LockIcon />
              })()}
            </FloatingActionButton>
          </div>
        </div>
        <footer style={style.footer}>
          Built by <em>Terrassa Rocket Team</em>
        </footer>
      </Container>
    )
  }
}

App.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(App)
