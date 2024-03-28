require('dotenv').config()

const express = require('express')

const app = express()

app.use(express.json())

const training = require('./routes/v1/training/training')
const userManagement = require('./routes/v1/userManagement/userManagement')
const queueManagement = require('./routes/v1/queueManagement/queueManagement')

app.use('/api/v1/training', training)
app.use('/api/v1/management/user', userManagement)
app.use('/api/v1/management/queue', queueManagement)

const PORT = process.env.port || 8080
app.listen(PORT, () => {
    console.log(`Listening to port : ${PORT}`)
})