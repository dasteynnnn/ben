const express = require('express')
const router = express.Router()

const controller = require('./userManagementController')

router.get('/', controller.retrieveUsers)

module.exports = router