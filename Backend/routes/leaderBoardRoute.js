require("dotenv").config()

const leaderBoardController = require('../controllers/leaderBoardController')
const express = require('express')
const router = express.Router()

const jwtAuth = require('../middlewares/jwtAuthMiddleware')
const adminAuth = require('../middlewares/adminAuthMiddleware')

router.post('/resetToInitialStats', [adminAuth], async(req, res) => {
    const response = await leaderBoardController.resetToInitialStats()
    res.status(response.isError ? 404 : 200).send(response)
})

router.post('/score', [jwtAuth], async(req, res) => {
    const response = await leaderBoardController.postScore(req.body.score, req.claims.userId, req.body.statId)
    res.status(response.isError ? 404 : 200).send(response)
})

router.get('/', [jwtAuth], async(req, res) => {
    const response = await leaderBoardController.getLeaderboard()
    res.status(response.isError ? 404 : 200).send(response)
})

module.exports = router