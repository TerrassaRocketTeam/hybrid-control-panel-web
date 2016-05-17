
import * as Colors from 'material-ui/styles/colors'
import { fade } from 'material-ui/utils/colorManipulator'
import Spacing from 'material-ui/styles/spacing'
import zIndex from 'material-ui/styles/zIndex'

export default {
  spacing: Spacing,
  zIndex,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#ff7777',
    primary2Color: Colors.blueGrey800,
    primary3Color: Colors.blueGrey700,
    accent1Color: '#ff7777',
    accent2Color: Colors.blueGrey900,
    accent3Color: Colors.blueGrey500,
    textColor: Colors.darkBlack, // darkBlack
    alternateTextColor: Colors.white, // white
    canvasColor: Colors.white,
    borderColor: Colors.blueGrey900,
    disabledColor: fade(Colors.darkBlack, 0.4),
    pickerHeaderColor: Colors.blueGrey600,
  },
}
