class ApplicationError extends Error {
  constructor(errorCode) {
    super(errorCode.message);
    this.statusCode = errorCode.statusCode;
    this.desc = errorCode.desc;
  }
}

module.exports = ApplicationError;
