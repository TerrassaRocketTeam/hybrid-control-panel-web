
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./root/root-prod').default
} else {
  module.exports = require('./root/root-dev').default
}
