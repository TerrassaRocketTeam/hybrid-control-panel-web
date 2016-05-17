
import React from 'react'

// Components
import App from '../components/app'
import RootProvider from './root'

const propTypes = {
  store: React.PropTypes.object,
  userAgent: React.PropTypes.string,
}

class Root extends React.Component {
  render () {
    return (
      <RootProvider {...this.props}>
        <div>
          <App />
        </div>
      </RootProvider>
    )
  }
}

Root.propTypes = propTypes

export default Root
