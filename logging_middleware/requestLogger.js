const { Log } = require('./logger');

// Simple request logger middleware that forwards structured logs to the central log API.
function requestLogger(req, res, next) {
  const startTime = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', function () {
    const elapsed = Date.now() - startTime;
    const message = `${method} ${originalUrl} -> ${res.statusCode} (${elapsed}ms)`;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    Log('backend', level, 'route', message).catch(() => {
      // swallow log errors so they do not break request flow
    });
  });

  next();
}

module.exports = requestLogger;
