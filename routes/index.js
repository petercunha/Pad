var express = require('express')
var shortid = require('shortid')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  var sid = shortid.generate()
  res.render('index', { title: 'Welcome to Pad', buttonLbl: 'Get started', id: sid })
})

module.exports = router
