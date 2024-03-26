require('dotenv').config()

const express = require('express')

const app = express()

app.use(express.json())

const userManagement = require('./routes/v1/userManagement/userManagement')

app.use('/api/v1/management/user', userManagement)

const PORT = process.env.port || 8080
app.listen(PORT, () => {
    console.log(`Listening to port : ${PORT}`)
})