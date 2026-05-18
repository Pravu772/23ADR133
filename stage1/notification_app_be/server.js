var http = require('http');
var https = require('https');
var logger = require('../logging_middleware/logger');

var PORT = process.env.PORT || 3000;
var AUTH_URL = 'http://4.224.186.213/evaluation-service/auth';
var NOTIFICATIONS_URL = 'http://4.224.186.213/evaluation-service/notifications';

function readBody(req, callback) {
  var text = '';
  req.on('data', function(chunk) {
    text += chunk;
  });
  req.on('end', function() {
    if (!text) {
      callback(null, {});
      return;
    }
    try {
      callback(null, JSON.parse(text));
    } catch (error) {
      callback(error);
    }
  });
}

function sendRequest(url, method, headers, body, callback) {
  var address = new URL(url);
  var client = address.protocol === 'https:' ? https : http;
  var options = {
    hostname: address.hostname,
    port: address.port || (address.protocol === 'https:' ? 443 : 80),
    path: address.pathname + address.search,
    method: method,
    headers: headers || {}
  };

  var req = client.request(options, function(res) {
    var text = '';
    res.on('data', function(chunk) {
      text += chunk;
    });
    res.on('end', function() {
      var data = {};
      try {
        data = JSON.parse(text || '{}');
      } catch (error) {
        data = { raw: text };
      }
      callback(null, res.statusCode, data);
    });
  });

  req.on('error', function(error) {
    callback(error);
  });

  if (body) {
    req.write(body);
  }
  req.end();
}

function getAuthToken(credentials, callback) {
  sendRequest(AUTH_URL, 'POST', { 'Content-Type': 'application/json' }, JSON.stringify(credentials), function(error, status, data) {
    if (error) {
      callback(error);
      return;
    }
    if (status !== 200 || !data.access_token) {
      callback(new Error('Auth failed: ' + status + ' ' + (data.message || JSON.stringify(data))));
      return;
    }
    callback(null, data.access_token);
  });
}

function replyJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function handleProxy(req, res) {
  readBody(req, function(error, body) {
    if (error) {
      replyJson(res, 400, { message: 'Invalid JSON body' });
      return;
    }

    var credentials = body.credentials || {
      email: process.env.AUTH_EMAIL,
      name: process.env.AUTH_NAME,
      rollNo: process.env.AUTH_ROLLNO,
      accessCode: process.env.AUTH_ACCESS_CODE,
      clientID: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET
    };

    if (!credentials.email || !credentials.accessCode || !credentials.clientID || !credentials.clientSecret) {
      replyJson(res, 400, { message: 'Auth credentials are required' });
      return;
    }

    logger.Log('backend', 'info', 'service', 'Requesting auth token', function() {});
    getAuthToken(credentials, function(error, token) {
      if (error) {
        logger.Log('backend', 'error', 'service', 'Auth failed: ' + error.message, function() {});
        replyJson(res, 500, { message: error.message });
        return;
      }

      logger.Log('backend', 'info', 'service', 'Fetched auth token', function() {});
      sendRequest(NOTIFICATIONS_URL, 'GET', { Authorization: 'Bearer ' + token }, null, function(error, status, data) {
        if (error) {
          logger.Log('backend', 'error', 'service', 'Notification request failed: ' + error.message, function() {});
          replyJson(res, 500, { message: error.message });
          return;
        }

        logger.Log('backend', 'info', 'service', 'Notification API returned ' + status, function() {});
        replyJson(res, status, data);
      });
    });
  });
}

var server = http.createServer(function(req, res) {
  if (req.method === 'POST' && req.url === '/proxy/notifications') {
    handleProxy(req, res);
    return;
  }
  replyJson(res, 404, { message: 'Not found' });
});

server.listen(PORT, function() {
  console.log('Backend proxy running on http://localhost:' + PORT);
});
