class EmailError extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 409;
  }
}

module.exports = EmailError;
