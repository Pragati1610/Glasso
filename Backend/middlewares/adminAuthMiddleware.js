const jwt = require('jsonwebtoken')

const adminAuth = (req, res, next) => {
    try {
        const token = req.get('Authorization')
        const claims = jwt.verify(token, process.env.JWT_PASS)
        const user = claims
        if (!user.isAdmin) {
            return res
                .status(403)
                .json({ message: 'You are forbidden from modifying this resource' })
        } else {
            next()
        }
    } catch (err) {
        console.log(err)
        return res.status(403).json({ error: err })
    }
}

module.exports = adminAuth