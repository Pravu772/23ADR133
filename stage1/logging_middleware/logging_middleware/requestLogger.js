const { Log } = require('./logger');

function requestLogger(req, res, next) {
  const startTime = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', function () {
    const elapsed = Date.now() - startTime;
    const message = `${method} ${originalUrl} -> ${res.statusCode} (${elapsed}ms)`;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    Log('backend', level, 'route', message).catch(() => {
    });
  });

  next();
}

module.exports = requestLogger;
