const { User } = require('../models/relations')
const logger = require('../logging/logger')

class UserController {
    static async createUser(auth) {
        try {
            const user = await User.findOne({ where: { email: auth.email } });
            if (user) {
                return {
                    isError: true,
                    message: "This email already exists",
                    status: 409
                };
            }
            const createdAuth = await User.create(auth, {
                attributes: { exclude: ['password'] }
            });
            createdAuth.password = null;
            return {
                message: 'User created',
                createdAuth,
                status: 200
            };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString(),
                status: 400
            };
        }
    }

    static async getAuthByEmail(auth) {
        try {
            let user = await User.findOne({ where: { email: auth.email, isAdmin: auth.isAdmin } });
            if (!user) {
                return {
                    message: "User doesn't exist",
                    isError: true
                }
            }
            return user;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }
}

module.exports = UserController