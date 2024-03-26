const API = 'USER-MANAGEMENT-1.0.0'
const uuid = require('uuidv4')
const TRAN_ID = uuid.uuid()
const date = new Date()
const db = require('../../../config/database/database');

var logger = require("../../../services/logger"); // command logs

exports.retrieveUsers = async (req, res) => {
    const ACTION = 'RETRIEVE-USERS'
    logger.info(API, ACTION, TRAN_ID, `REQUEST`)

    const query = `select * from users`

    let retrieveUsers = await db.query(query)

    let reverse = str => {
        return str.split('').reverse().join('')
    }

    let reverseInt = int => {
        let reverse = parseInt(int.toString().split('').reverse().join(''))
        return reverse * Math.sign(int)
    }

    let palindrome = str => {
        let reversed = str.split('').reverse().join('')
        return reversed === str
    }

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