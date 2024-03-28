const API = 'USER-MANAGEMENT-1.0.0'
const uuid = require('uuidv4')
const date = new Date()
const db = require('../../../config/database/database');

var logger = require("../../../services/logger"); // command logs

exports.retrieveUsers = async (req, res) => {
    const ACTION = 'RETRIEVE-USERS'
    const TRAN_ID = uuid.uuid()
    logger.info(API, ACTION, TRAN_ID, `REQUEST`)

    const query = `select * from users`

    let retrieveUsers = await db.query(query)

    const response = {
        status: 'Success',
        tranId: TRAN_ID,
        details: retrieveUsers
    }

    logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)

    res.send(response)
}