require("dotenv").config()

const userController = require('../controllers/userController')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const jwtAuth = require('../middlewares/jwtAuthMiddleware')

router.post('/signup', async(req, res) => {

    // if (req.body.isAdmin === true) {
    //     return res.status(406).send({ message: 'User cannot be created' })
    // }

    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT))
    req.body.password = bcrypt.hashSync(req.body.password, salt)
    const response = await userController.createUser(req.body)

    if (!response.isError) {
        const token = jwt.sign(JSON.stringify(response.createdAuth), process.env.JWT_PASS)
        response.token = token
        response.createdAuth.password = null
    }
    return res.status(response.status).send(response)
})

router.post('/login', async(req, res) => {
    const user = await userController.getAuthByuserName(req.body)
    if (!user.isError) {
        const match = bcrypt.compareSync(req.body.password, user.password)
        const token = jwt.sign(JSON.stringify(user), process.env.JWT_PASS)
        user.password = null
        return res.status(match ? 200 : 400).send({ user, token })
    } else {
        console.log(user)
        return res.status(400).send({ message: 'User not authorized', m: user.message })
    }
})

router.get('/profile', [jwtAuth], async(req, res) => {
    console.log(req.claims.userId)
    const response = await userController.getProfile(req.claims.userId)
    res.status(response.isError ? 404 : 200).send(response)
})

router.get('/profile/:userId', [jwtAuth], async(req, res) => {
    const response = await userController.getProfile(req.params.userId)
    res.status(response.isError ? 404 : 200).send(response)
})

router.patch('/profile/:userId', [jwtAuth], async(req, res) => {

    if (req.body.password) {
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT))
        req.body.password = bcrypt.hashSync(req.body.password, salt)
    }
    const response = await userController.patchProfile(req.params.userId, req.body)
    if (!response.isError) {
        const token = jwt.sign(JSON.stringify(response.user), process.env.JWT_PASS)
        response.token = token
    }
    res.status(response.isError ? 404 : 200).send(response)
})


module.exports = router