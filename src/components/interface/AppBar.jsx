
import React from 'react'
import { pure } from 'recompose'

// Components
import Toolbar from 'material-ui/Toolbar'
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup'
import IconButton from 'material-ui/IconButton'
import IconSVG from 'material-ui/svg-icons/image/assistant'

// Styles
import * as style from './AppBar.style.js'

const propTypes = {}

function AppBar () {
  return (
    <div style={style.container}>
      <Toolbar style={style.bar}>
        <ToolbarGroup firstChild float="left">
          <span style={style.title}>TRT hybrid - Control Panel</span>
        </ToolbarGroup>
      </Toolbar>
    </div>
  )
}

AppBar.propTypes = propTypes

export default pure(AppBar)
