const express = require('express');
var router = express.Router();

router.get('/setcookie', (req, res) => {
  res.cookie(`auth`,`My Token Value`);
  res.send('Cookie have been saved successfully');
});

router.get('/servercookie', (req, res) => {
  res.json({
    auth:"Authenticated yea",
    other:"Other Cookie Dont Know"
  });
});

router.get('/getcookie', (req, res) => {
  console.log(req.cookies);
  res.send(req.cookies);
});

module.exports = router;