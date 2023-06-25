class ForbiddenError extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
