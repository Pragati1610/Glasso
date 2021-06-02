const User = require('./user')

if (process.env.SYNC) {
    User.sync({
        force: true
    })
}
module.exports = { User }