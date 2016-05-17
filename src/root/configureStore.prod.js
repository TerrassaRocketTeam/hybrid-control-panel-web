
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../stores/reducer'
import thunk from 'redux-thunk'

const finalCreateStore = (reducer, initialState) => (
  createStore(
    reducer,
    initialState,
    compose(
      // Middleware you want to use in production:
      applyMiddleware(thunk)
      // Other store enhancers if you use any
    )
  )
)

export default function configureStore (initialState) {
  return finalCreateStore(rootReducer, initialState)
}
