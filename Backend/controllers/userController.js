require("dotenv").config()

const { User } = require('../models/relations')
const logger = require('../logging/logger')

class UserController {
    static async createUser(auth) {
        try {
            let user = await User.findOne({ where: { email: auth.email } })
            if (user) {
                return {
                    isError: true,
                    message: "This email already exists",
                    status: 409
                }
            }

            user = await User.findOne({ where: { userName: auth.userName } })
            if (user) {
                return {
                    isError: true,
                    message: "This userName already exists",
                    status: 409
                }
            }

            auth.points = 20
                // auth.isAdmin = false
            const createdAuth = await User.create(auth)
            return {
                message: 'User created',
                createdAuth,
                status: 200
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

    static async getAuthByuserName(auth) {
        try {
            let user = await User.findOne({ where: { userName: auth.userName } })
            if (!user) {
                return {
                    message: "User doesn't exist",
                    isError: true
                }
            }
            return user
        } catch (e) {
            logger.error(e)
            return {
                isError: true,
                message: e.toString()
            }
        }
    }

    static async getProfile(userId) {
        try {
            let user = await User.findOne({ where: { userId }, raw: true })
            if (!user) {
                return {
                    message: "User doesn't exist",
                    isError: true
                }
            }
            delete user.password
            return user
        } catch (e) {
            logger.error(e)
            return {
                isError: true,
                message: e.toString()
            }
        }
    }

    static async patchProfile(userId, auth) {
        try {
            let user = await User.findOne({ where: { userId } })
            if (!user) {
                return {
                    isError: true,
                    message: "No user with this userId exists",
                    status: 409
                }
            }

            auth.points = user.points
            auth.isAdmin = false

            const updatedAuth = await User.update(auth, { where: { userId } })
            user = await User.findOne({ where: { userId } })
            return {
                message: 'User updated',
                updatedAuth,
                user,
                status: 200
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


}

module.exports = UserController