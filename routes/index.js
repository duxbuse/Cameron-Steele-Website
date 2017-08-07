var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('index', {
    title: 'Home'
  });
});

router.get('/bio', function(req, res){
  res.render('bio', {
    title: 'Bio'
  });
});

router.get('/music', function(req, res){
  res.render('music', {
    title: 'Music'
  });
});

router.get('/contact', function(req, res){
  res.render('contact', {
    title: 'Contact'
  });
});

module.exports = router;