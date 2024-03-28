const API = 'TRAINING-1.0.0'
const uuid = require('uuidv4')
const TRAN_ID = uuid.uuid()

var logger = require("../../../services/logger"); // command logs

exports.reverse = (req, res) => {
    const ACTION = 'REVERSE'
    logger.info(API, ACTION, TRAN_ID, `REQUEST`)

    let reverse = str => {
        return str.split('').reverse().join('')
    }
    const response = {
        status : 'Success',
        tranId : TRAN_ID,
        details : reverse('dustin')
    }

    logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)

    res.send(response)
}

exports.reverseInt = (req, res) => {
    const ACTION = 'REVERSE-INT'
    logger.info(API, ACTION, TRAN_ID, `REQUEST`)

    let reverseInt = int => {
        let reverse = parseInt(int.toString().split('').reverse().join(''))
        return reverse * Math.sign(int)
    }
    const response = {
        status : 'Success',
        tranId : TRAN_ID,
        details : reverseInt(522)
    }

    logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)

    res.send(response)
}

exports.palindrome = (req, res) => {
    const ACTION = 'PALINDROME'
    logger.info(API, ACTION, TRAN_ID, `REQUEST`)

    let palindrome = str => {
        let reversed = str.split('').reverse().join('')
        return reversed === str
    }
    const response = {
        status : 'Success',
        tranId : TRAN_ID,
        details : palindrome('maam')
    }

    logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)

    res.send(response)
}

exports.maxChar = (req, res) => {
    const ACTION = 'MAX-CHARACTER'
    logger.info(API, ACTION, TRAN_ID, `REQUEST`)

    let maxChar = str => {
        const charMap = {}
        let max = 0
        let maxChar = ''

        for(char of str){
            charMap[char] = ++charMap[char] || 1
        }

        for(key in charMap){
            if(charMap[key] > max){
                max = charMap[key]
                maxChar = key
            }
        }

        return maxChar
    }
    const response = {
        status : 'Success',
        tranId : TRAN_ID,
        details : maxChar('dusstiiinnnn')
    }

    logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)

    res.send(response)
}

exports.chunk = (req, res) => {
    const ACTION = 'CHUNK-ARRAY'
    logger.info(API, ACTION, TRAN_ID, `REQUEST`)

    let chunk = (array, size) => {
        const result = []
        let index = 0

        while(index < array.length){
            result.push(array.slice(index, index + size))
            index += size
        }
        
        return result
    }
    const response = {
        status : 'Success',
        tranId : TRAN_ID,
        details : chunk([1,2,3,4,5,6], 3)
    }

    logger.info(API, ACTION, TRAN_ID, `RESPONSE`, response)

    res.send(response)
}