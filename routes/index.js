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

router.post('/contact', function(req, res){
    console.log(req.body.message.name)
    console.log(req.body.message.emailaddress)
    console.log(req.body.message.subject)
    console.log(req.body.message.content)

    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // const msg = {
    //   to: 'duxbuse@gmail.com',
    //   from: 'admin@steele-music.com',
    //   subject: 'Sending with SendGrid is Fun',
    //   text: 'and easy to do anywhere, even with Node.js',
    //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    // };
    
    // sgMail.send(msg);
    // console.log("Form Message has been sent")

    res.render('sentMessage', {
      title: 'sentMessage'
    });
});

module.exports = router;