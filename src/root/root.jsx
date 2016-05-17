
import React from 'react'
import { Provider } from 'react-redux'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { StyleRoot } from 'radium'

// Style
import theme from '../theme.js'

const propTypes = {
  store: React.PropTypes.object,
  history: React.PropTypes.object,
  userAgent: React.PropTypes.string,
  children: React.PropTypes.node,
}

const childContextTypes = {
  muiTheme: React.PropTypes.object,
}

class RootProvider extends React.Component {
  getChildContext () {
    return {
      muiTheme: getMuiTheme(theme, { userAgent: this.props.userAgent }),
    }
  }
  render () {
    return (
      <StyleRoot radiumConfig={{ userAgent: this.props.userAgent }}>
        <Provider store={this.props.store}>
          {this.props.children}
        </Provider>
      </StyleRoot>
    )
  }
}

RootProvider.propTypes = propTypes
RootProvider.childContextTypes = childContextTypes

export default (RootProvider)
