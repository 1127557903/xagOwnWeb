const express = require("express")
const router =  express.Router()
const db = require('../../../connect/connect')

router.get('/',(req,res) => {
    res.render('home/home')
})

module.exports = router