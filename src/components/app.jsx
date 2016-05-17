
require('perfnow') // Polyfill performane.now

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import DataProcessor from './dataProcessor/DataProcessor'

// Components
import AppBar from './interface/AppBar'
import Controls from './controls/Controls'
import Container from './container'

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

    this.state = {
      dp: new DataProcessor(this.props.handleStateChange, this.handleNewData),
      lastData: [],
    }
  }

  handleNewData (data) {
    this.setState({
      lastData: data,
    })
  }

  handleConnectionStart (comPort) {
    this.state.dp.connect(comPort, this.props.user)
  }

  handleDisconnectSerial () {
    this.state.dp.disconnect(this.props.user)
  }

  handleIgnitorCheck () {
    this.props.handleStateChange('ignitorChecked', undefined)
    this.state.dp.checkIgnitor(this.props.user)
  }

  handleLaunch () {
    this.state.dp.launch(this.props.user)
  }

  handleAbortLaunch () {
    this.state.dp.abortLaunch(this.props.user)
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
        />
        <footer style={style.footer}>
          Built by <em>Terrassa Rocket Team</em>
        </footer>
      </Container>
    )
  }
}

App.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(App)
