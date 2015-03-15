var DBPFError = function (cause, statusNumber) {
  this.statusNumber = statusNumber || 500;
  this.errorObject = {
    cause: cause
  }
}

DBPFError.prototype = Object.create(Error.prototype);

module.exports = DBPFError;