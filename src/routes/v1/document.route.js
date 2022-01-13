const express = require('express')
const documentController = require('../../controllers/document.controller')

const router = express.Router()

router
    .route('/poll')
    .post(
        documentController.pollResource
    )
module.exports = router
