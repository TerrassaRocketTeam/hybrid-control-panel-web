
'use strict' // eslint-disable-line strict

const path = require('path')

const components = {
  web: require(path.join(__dirname, '../../views/react/server')).default,
}

/** We use this middleware to react render **/
module.exports = (req, res, next) => {
  res.reactRender = (state) => { // eslint-disable-line no-param-reassign
    const component = components.web(req.headers['user-agent'])

    const store = component.configureStore(state.initial)

    const s = Object.assign(
      {
        layout: 'web',
        production: process.env.NODE_ENV === 'production',
      },
      state,
      {
        react: Object.assign(
          state.react || {},
          {
            body: {
              initialState: JSON.stringify(store.getState()),
              // rendered: ReactDOMServer.renderToString(component.component(store)),
              rendered: `
              <span>LOADING!</span>
              `,
            },
          }
        ),
      }
    )

    return res.render('react', s)
  }

  next()
}
