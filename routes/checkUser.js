
module.exports = (user) => {
  if (user) {
    const userIndex = global.users.findIndex((u) => (u.token === user))

    if (userIndex > -1) {
      return { // eslint-disable-line
        is: true,
        status: 200,
        msg: '',
        userIndex,
      }
    }
    return { // eslint-disable-line
      is: false,
      status: 401,
      msg: 'User incorrect',
    }
  }
  return { // eslint-disable-line
    is: false,
    status: 400,
    msg: 'No user query was provided',
  }
}
