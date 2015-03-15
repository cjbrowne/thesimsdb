var pg = require('pg');
var fs = require('fs');
var DBPF = require('../dbpf/');

module.exports = function(req, res, next) {
  var fileData = fs.readFileSync(req.files.file.path);
  if(fileData.slice(0, 4) == 'DBPF') {
    try {
      var parsedData = DBPF.parse(fileData);
      // actually we're gonna put the parsed data into postgres, eventually
      res.status(200).send(parsedData);
    } catch (e) {
      if (e instanceof DBPF.DBPFError) {
        console.log('DBPF error:', e);
        res.status(e.statusNumber).send(e.errorObject);
      } else {
        console.log('Something bad happened: ', e);
        res.status(500).send(e);
      }
    }
  } else {
    console.log(fileData.slice(0, 4));
    res.status(422).send({
      error: 'Not a DBPF file'
    });
  }
}