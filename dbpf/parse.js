var DBPFError = require('./error');


module.exports = function (inputFile) {
  var seekHead = 0;
  var simInfo = {};
  var index = {};
  var holes = {};

  var read_uint = function () {
    var uint_buffer = inputFile.slice(seekHead, seekHead + 4);
    var uint = 0;
    uint = uint_buffer[0] |
           (uint_buffer[1] << 8) |
           (uint_buffer[2] << 16) |
           (uint_buffer[3] << 24)
    ;
    seekHead += 4;
    return uint;
  };

  var checkForMagicHeader = function () {
    if(inputFile.slice(0, 4) != 'DBPF') {
      console.log(inputFile.slice(0,4));
      throw new DBPFError('Not a DBPF file', 422);
    }
    seekHead += 4;
  };

  var checkVersion = function () {
    var majorVersion = read_uint();
    var minorVersion = read_uint();
    var version = majorVersion + (minorVersion / 10);
    if (version >= 2) {
      throw new DBPFError('Unsupported DBPF version: ' + version, 501);
    }
    if (minorVersion > 1) {
      console.warn('Strange DBPF version found: ' + version);
    }
  };

  var fastForward = function (amount) {
    seekHead += amount;
  };

  // used to peek at x bytes, returns them as a string of hex characters
  var peek = function (amount) {
    var bytes = inputFile.slice(seekHead, seekHead + amount);
    var string = '';
    var i = 0;
    for(;i<bytes.length;i++) {
      string += '0x' + bytes[i].toString(16) + ' ';
    }
    return string;
  };

  var logCurrentInt = function () {
    console.log('0x' + seekHead.toString(16), peek(4));
  };

  if(!inputFile instanceof ArrayBuffer) {
    throw new DBPFError('Not a buffer object', 500);
  }

  // first check for the 'DBPF' string
  checkForMagicHeader(inputFile);

  // next, check if the version is supported
  checkVersion(inputFile);

  // now skip 12 bytes of reserved space
  fastForward(12);

  

  // next comes the created and modified dates
  simInfo.dateCreated = read_uint();
  simInfo.dateModified = read_uint();

  logCurrentInt();

  // now the index tables
  index.majorVersion = read_uint();
  index.count = read_uint();
  index.offset = read_uint();
  index.size = read_uint();

  // now the holes
  holes.count = read_uint();
  holes.offset = read_uint();
  holes.size = read_uint();

  // now the minor index version
  index.minorVersion = read_uint() - 1;

  // skip 32 bytes of reserved space
  fastForward(32);

  console.log(seekHead, index, holes, simInfo);

  return simInfo;
}