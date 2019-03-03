const express = require('express')
const router = express.Router()
// const request = require('request')

router.get('/maps', (req, res) => {
  res.render('maps.hbs')
})


module.exports = router