const express = require('express')

const documentRoute = require('./document.route')

const utilsRoute = require('./utils.route')


const router = express.Router()

const defaultRoutes = [
   
    {
        path: '/document',
        route: documentRoute,
    },
   
    {
        path: '/utils',
        route: utilsRoute,
    },
   
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

module.exports = router
