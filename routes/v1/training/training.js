const express = require('express')
const router = express.Router()

const trainingController = require('./trainingController')

router.get('/reverse/string', trainingController.reverse)
router.get('/reverse/int', trainingController.reverseInt)
router.get('/palindrome', trainingController.palindrome)
router.get('/maxchar', trainingController.maxChar)
router.get('/chunk', trainingController.chunk)

module.exports = router