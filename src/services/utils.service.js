const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')



const currentTime = async () => {
    try {
        return Date().toString()
    } catch (error) {
        if (!error.isOperational) {
            throw new ApiError(httpStatus.CONFLICT, 'Not found')
        } else throw error
    }
}



module.exports = {
    
    currentTime,
}
