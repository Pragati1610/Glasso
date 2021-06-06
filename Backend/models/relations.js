const User = require('./user')
const Stats = require('./stats')

if (process.env.SYNC) {
    User.sync({
        alter: true
    })
    Stats.sync({
        alter: true
    })
}

module.exports = { User, Stats }