
const checkUser = require('../checkUser')

/** We use this middleware to check if the user is loged in **/
module.exports = (req, res, next) => {
  req.loggedIn = checkUser(req.query.user) // eslint-disable-line
  next()
}
