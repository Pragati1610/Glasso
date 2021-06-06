require("dotenv").config()

const { User, Stats } = require('../models/relations')
const logger = require('../logging/logger')
var sortJsonArray = require('sort-json-array')

class LeaderBoardController {

    static async resetToInitialStats() {
        try {
            let body = {
                wins: 0,
                loses: 0,
                draws: 0
            }
            let stat = await Stats.create(body)
            return stat
        } catch (e) {
            logger.error(e)
            return {
                isError: true,
                message: e.toString()
            }
        }
    }

    static async postScore(score, userId, statId) {
        try {
            const user = await User.findOne({ where: { userId }, raw: true })
            if (!user) {
                return {
                    isError: true,
                    message: "No such user exist"
                }
            }

            user.points += (score * 5)

            let stats = await Stats.findOne({ where: { statId }, raw: true })

            if (score === 1) {
                stats.wins += 1
            } else {
                if (score === -1) {
                    stats.loses += 1
                } else {
                    stats.draws += 1
                }
            }

            const updateUser = await User.update(user, { where: { userId } })
            const updateStats = await Stats.update(stats, { where: { statId: stats.statId } })

            return {
                message: 'Update',
                updateUser,
                updateStats
            }
        } catch (e) {
            logger.error(e)
            return {
                isError: true,
                message: e.toString(),
                status: 400
            }
        }
    }

    static async getLeaderboard() {
        try {
            let users = await User.findAll({ raw: true })
            users = sortJsonArray(users, 'points', 'des')
            users = users.map((user) => {
                delete user.password
                delete user.isAdmin
                delete user.name
                delete user.email
                return user
            })
            return users
        } catch (e) {
            logger.error(e)
            return {
                isError: true,
                message: e.toString()
            }
        }
    }
}

module.exports = LeaderBoardController