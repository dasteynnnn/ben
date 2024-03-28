const API = 'QUEUE-MANAGEMENT-1.0.0'
const uuid = require('uuidv4')
const service = require('./queueManagementService')

const redisClient = require('../../../services/cache');

var logger = require("../../../services/logger"); // command logs

const redisKey = 'queueManagement-1.0.0'
const redisKeyQueue = redisKey + '-queue'
const redisKeyLastQueue = redisKey + '-lastQueue'

exports.retrieveQueue = async (req, res) => {
    const ACTION = 'RETRIEVE-QUEUE'
    const TRAN_ID = uuid.uuid()

    logger.info(API, ACTION, TRAN_ID, `REQUEST`)

    const queue = JSON.parse(await redisClient.GET(redisKeyQueue))

    const response = service.successResponse(TRAN_ID, queue == null ? 'Empty Queue' : queue)

    logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)

    res.send(response)
}

exports.newQueue = async (req, res) => {
    const ACTION = 'NEW-QUEUE'
    const TRAN_ID = uuid.uuid()
    const body = req.body

    logger.info(API, ACTION, TRAN_ID, `REQUEST`, body)

    let queueType = body.type

    if(queueType == undefined || queueType == null || queueType == ''){
        const details = 'Invalid Queue Type'
        logger.error(API, ACTION, TRAN_ID, `RESPONSE`, details)
        return res.status(500).send(service.failedResponse(TRAN_ID, details))
    }

    let queue = JSON.parse(await redisClient.GET(redisKeyQueue))
    let lastQueue = await redisClient.GET(redisKeyLastQueue)
    if(lastQueue == null || lastQueue == 'NaN' || !lastQueue) lastQueue = 0
    const nextQueue = parseInt(lastQueue) + 1

    let newQueue = {
        number: nextQueue,
        code: Math.random().toString(36).slice(2, 7),
        type: queueType,
        assigned: 'false'
    }

    if(queue == null) queue = {line : []}
    
    queue.line.push(newQueue)

    redisClient.SET(redisKeyQueue, JSON.stringify(queue));
    redisClient.SET(redisKeyLastQueue, nextQueue);

    const response = service.successResponse(TRAN_ID, newQueue)

    logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)

    res.send(response)
}

exports.getQueue = async (req, res) => {
    const ACTION = 'GET-QUEUE'
    const TRAN_ID = uuid.uuid()
    const body = req.body

    logger.info(API, ACTION, TRAN_ID, `REQUEST`, body)

    let queueType = body.type
    let counter = body.counter

    if(queueType == undefined || queueType == null || queueType == ''){
        const details = 'Invalid Queue Type'
        logger.error(API, ACTION, TRAN_ID, `RESPONSE`, details)
        return res.status(500).send(service.failedResponse(TRAN_ID, details))
    }

    const queue = JSON.parse(await redisClient.GET(redisKeyQueue))

    if(queue == null){
        const details = 'Queue line is empty!'
        logger.error(API, ACTION, TRAN_ID, `RESPONSE`, details)
        return res.status(500).send(service.failedResponse(TRAN_ID, details))
    }

    let candidates = []

    for(q of queue.line){
        if(q.type == queueType && q.assigned == 'false'){
            candidates.push(q.number)
        }
    }

    let sortedCandidates = candidates.sort()

    let queueDetails = {
        counter,
        number : ''
    }

    for(q of queue.line){
        if(q.number == sortedCandidates[0]){
            queueDetails.number = q.code
            q.assigned = 'true'
        }
    }

    redisClient.SET(redisKeyQueue, JSON.stringify(queue));

    const response = service.successResponse(TRAN_ID, queueDetails.number == '' ? `No Available queue for ${queueType}` : queueDetails)

    logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)

    res.send(response)
}

exports.skipQueue = async (req, res) => {
    const ACTION = 'SKIP-QUEUE'
    const TRAN_ID = uuid.uuid()
    const body = req.body

    logger.info(API, ACTION, TRAN_ID, `REQUEST`, body)

    const currentQueueCode = body.number

    if(currentQueueCode == undefined || currentQueueCode == null || currentQueueCode == ''){
        const details = 'Invalid Queue Number'
        logger.error(API, ACTION, TRAN_ID, `RESPONSE`, details)
        return res.status(500).send(service.failedResponse(TRAN_ID, details))
    }

    const queue = JSON.parse(await redisClient.GET(redisKeyQueue))
    let lastQueue = await redisClient.GET(redisKeyLastQueue)
    if(lastQueue == null || lastQueue == 'NaN' || !lastQueue) lastQueue = 0
    const nextQueue = parseInt(lastQueue) + 1

    if(queue == null){
        const details = 'Queue line is empty!'
        logger.error(API, ACTION, TRAN_ID, `RESPONSE`, details)
        return res.status(500).send(service.failedResponse(TRAN_ID, details))
    }

    for(q of queue.line){
        if(q.code == currentQueueCode){
            q.number = nextQueue
            q.assigned = 'false'
        }
    }

    redisClient.SET(redisKeyQueue, JSON.stringify(queue));
    redisClient.SET(redisKeyLastQueue, nextQueue);

    const response = service.successResponse(TRAN_ID, 'Queue skipped!')

    logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)

    res.send(response)

}

exports.removeQueue = async (req, res) => {
    const ACTION = 'REMOVE-QUEUE'
    const TRAN_ID = uuid.uuid()
    const body = req.body

    logger.info(API, ACTION, TRAN_ID, `REQUEST`, body)

    const currentQueueCode = body.number

    if(currentQueueCode == undefined || currentQueueCode == null || currentQueueCode == ''){
        const details = 'Invalid Queue Number'
        logger.error(API, ACTION, TRAN_ID, `RESPONSE`, details)
        return res.status(500).send(service.failedResponse(TRAN_ID, details))
    }

    const queue = JSON.parse(await redisClient.GET(redisKeyQueue))

    if(queue == null){
        const details = 'Queue line is empty!'
        logger.error(API, ACTION, TRAN_ID, `RESPONSE`, details)
        return res.status(500).send(service.failedResponse(TRAN_ID, details))
    }

    let index = queue.line.findIndex(data => {
        return data.code == currentQueueCode
    })

    if(index == -1){
        const details = 'Invalid queue number!'
        logger.error(API, ACTION, TRAN_ID, `RESPONSE`, details)
        return res.status(500).send(service.failedResponse(TRAN_ID, details))
    }
    
    queue.line.splice(index, 1);

    redisClient.SET(redisKeyQueue, JSON.stringify(queue));

    const response = service.successResponse(TRAN_ID, `Queue ${currentQueueCode} is removed!`)

    logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)

    res.send(response)
}

exports.clearQueue = async (req, res) => {
    const ACTION = 'CLEAR-QUEUE'
    const TRAN_ID = uuid.uuid()

    logger.info(API, ACTION, TRAN_ID, `REQUEST`)

    redisClient.DEL(redisKeyQueue);
    redisClient.DEL(redisKeyLastQueue);

    const response = service.successResponse(TRAN_ID, 'Queue is cleared!')

    logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)

    res.send(response)
}