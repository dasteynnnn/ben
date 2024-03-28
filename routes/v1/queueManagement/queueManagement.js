const express = require('express')
const router = express.Router()

const queueManagementController = require('./queueManagementController')

router.get('/', queueManagementController.retrieveQueue)
router.post('/', queueManagementController.newQueue)
router.post('/get', queueManagementController.getQueue)
router.post('/skip', queueManagementController.skipQueue)
router.post('/remove', queueManagementController.removeQueue)
router.get('/clear', queueManagementController.clearQueue)

module.exports = router