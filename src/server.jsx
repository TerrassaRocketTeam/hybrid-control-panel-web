
// import React from 'react'
//
// // Components
// import Root from './root'

// Redux
import configureStore from './root/configureStore'

export default function (/* userAgent */) {
  return {
    // component: (storeInstance) => (
    //   <Root store={storeInstance} userAgent={userAgent} />
    // ),
    configureStore,
  }
}
