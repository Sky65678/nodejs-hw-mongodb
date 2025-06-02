import createError from 'http-errors';

function notFoundHandler(req, res, next) {
  throw createError(404, 'Contact not found');
}

export default notFoundHandler;
