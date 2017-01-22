var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('index', { title: 'Dashboard' })
});

router.get('/dashboardDEMO', function(req, res, next) {
  res.render('indexDEMO', { title: 'Dashboard' })
});

router.get('/cashflow', function(req, res, next) {
  res.render('cashflow', { title: 'Cashflow' })
});

router.get('/marketing', function(req, res, next) {
  res.render('marketing', { title: 'Dashboard' })
});

router.get('/discover', function(req, res, next) {
  res.render('discover', { title: 'Cashflow' })
});

module.exports = router;
