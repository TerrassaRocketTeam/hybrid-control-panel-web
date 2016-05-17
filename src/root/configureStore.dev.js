
import { createStore, applyMiddleware, compose } from 'redux'
import { persistState } from 'redux-devtools'
import rootReducer from '../stores/reducer'
import DevTools from './DevTools'
import thunk from 'redux-thunk'

function getDebugSessionKey () {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  if (typeof window !== typeof undefined) {
    const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/)
    return (matches && matches.length > 0) ? matches[1] : null
  }
  return null
}

const finalCreateStore = (reducer, initialState) => (
  createStore(
    reducer,
    initialState,
    compose(
      // Middleware you want to use in development:
      applyMiddleware(thunk),
      // Required! Enable Redux DevTools with the monitors you chose
      DevTools.instrument(),
      // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
      persistState(getDebugSessionKey())
    )
  )
)

export default function configureStore (initialState) {
  const store = finalCreateStore(rootReducer, initialState)

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../stores/reducer', () =>
      store.replaceReducer(require('../stores/reducer')).default // .default if you use Babel 6+
    )
  }

  // Hot reload reducers (livereactload to be enabled)
  if (module.onReload) {
    module.onReload(() => {
      const nextReducer = require('../stores/reducer')
      store.replaceReducer(nextReducer.default || nextReducer)
      return true
    })
  }

  return store
}
