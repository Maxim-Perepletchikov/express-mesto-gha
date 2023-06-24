class AuthorizationError extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 401;
  }
}

module.exports = AuthorizationError;
