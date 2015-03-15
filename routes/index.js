var express = require('express');
var router = express.Router();

var DUMMY_DATA = {
  title: 'My Sims',
  sims: [
    {
      first_name: 'Fooby',
      last_name: 'McFoo',
      gender: 'm',
      life_stage: 'adult'
    },
    {
      first_name: 'Barby',
      last_name: 'McBar',
      gender: 'f',
      life_stage: 'child'
    },
    {
      first_name: 'Fuzbang',
      last_name: 'McBazWheezle',
      gender: 'm',
      life_stage: 'adult'
    }
  ]
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', DUMMY_DATA);
});

/* upload a sim */
router.post('/upload', require('./upload'));

module.exports = router;
