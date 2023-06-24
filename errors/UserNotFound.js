class UserNotFound extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 404;
  }
}

module.exports = UserNotFound;
