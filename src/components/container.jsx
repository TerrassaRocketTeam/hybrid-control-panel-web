
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Actions
import { pushWindowSize } from '../actions/display.js'

function mapStateToProps (state) { // eslint-disable-line no-unused-vars
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    pushWindowSize: bindActionCreators(pushWindowSize, dispatch),
  }
}

const propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.node,
    React.PropTypes.arrayOf(React.PropTypes.node),
  ]),
  pushWindowSize: React.PropTypes.func,
}

class ViewContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleResizeWindowEvent = this.handleResizeWindowEvent.bind(this)
  }

  componentDidMount () {
    this.props.pushWindowSize(window.innerWidth, window.innerHeight)
    if (window.attachEvent) {
      // For IE 9
      window.attachEvent('onresize', this.handleResizeWindowEvent)
    } else if (window.addEventListener) {
      window.addEventListener('resize', this.handleResizeWindowEvent, true)
    }
  }

  componentWillUnmount () {
    if (window.attachEvent) {
      // For IE 9
      window.detachEvent('onresize', this.handleResizeWindowEvent)
    } else if (window.addEventListener) {
      window.removeEventListener('resize', this.handleResizeWindowEvent)
    }
  }

  handleResizeWindowEvent () {
    this.props.pushWindowSize(window.innerWidth, window.innerHeight)
  }

  render () {
    return (
      <main>
        {this.props.children}
      </main>
    )
  }
}

ViewContainer.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer)
