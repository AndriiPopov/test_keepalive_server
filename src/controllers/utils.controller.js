const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')

const { utilsService } = require('../services')


const currentTime = catchAsync(async (req, res) => {
    const result = await utilsService.currentTime()
    res.status(httpStatus.OK).send({time: result})
})

module.exports = {
    currentTime
}
