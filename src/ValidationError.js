export default class ValidationError extends Error {
  constructor(message) {
    super();
    Object.defineProperty(this, 'message', {
      value: message
    });
  }
  get name() {
    return 'ValidationError';
  }
}
