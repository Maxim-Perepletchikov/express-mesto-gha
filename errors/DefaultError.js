class DefaultError extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 500;
  }
}

module.exports = DefaultError;
