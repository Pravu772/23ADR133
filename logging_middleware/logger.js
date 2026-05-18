var http = require('http');
var https = require('https');

var LOG_URL = process.env.LOGGING_ENDPOINT || 'http://4.224.186.213/evaluation-service/logs';
var AUTH_URL = process.env.AUTH_ENDPOINT || 'http://4.224.186.213/evaluation-service/auth';
var AUTH_CREDENTIALS = {
  email: process.env.AUTH_EMAIL || 'ramkrishna@abc.edu',
  name: process.env.AUTH_NAME || 'ram krishna',
  rollNo: process.env.AUTH_ROLLNO || 'aa1bb',
  accessCode: process.env.AUTH_ACCESS_CODE || 'xgAsNC',
  clientID: process.env.AUTH_CLIENT_ID || 'd9cbb699-6a27-44a5-8d59-8b1befa816da',
  clientSecret: process.env.AUTH_CLIENT_SECRET || 'tVJaaaRBSeXcRXeM'
};

function requestJson(url, method, headers, body, callback) {
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

function getLogToken(callback) {
  requestJson(AUTH_URL, 'POST', { 'Content-Type': 'application/json' }, JSON.stringify(AUTH_CREDENTIALS), function(error, status, data) {
    if (error) {
      callback(error);
      return;
    }
    if (status !== 200 || !data.access_token) {
      callback(new Error('Log auth failed: ' + status + ' ' + (data.message || JSON.stringify(data))));
      return;
    }
    callback(null, data.access_token);
  });
}

function Log(stack, level, packageName, message, callback) {
  var send = function(token) {
    var payload = JSON.stringify({
      stack: String(stack || 'backend').toLowerCase(),
      level: String(level || 'info').toLowerCase(),
      package: String(packageName || 'service').toLowerCase(),
      message: String(message || ''),
      timestamp: new Date().toISOString()
    });

    requestJson(LOG_URL, 'POST', {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }, payload, function(error, status, data) {
      if (callback) {
        callback(error, { status: status, body: data });
      }
    });
  };

  getLogToken(function(error, token) {
    if (error) {
      if (callback) {
        callback(error);
      }
      return;
    }
    send(token);
  });
}

module.exports = { Log: Log };
