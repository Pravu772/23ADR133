var AUTH_URL = 'http://4.224.186.213/evaluation-service/auth';
var NOTIFICATIONS_URL = 'http://4.224.186.213/evaluation-service/notifications';
var TOP_N = 10;

var PRIORITY_MAP = {
  Placement: 3,
  Result: 2,
  Event: 1
};

var SAMPLE_NOTIFICATIONS = [
  { ID: 'd146095a-0d86-4a34-9e69-3900a14576bc', Type: 'Result', Message: 'mid-sem', Timestamp: '2026-04-22 17:51:30' },
  { ID: 'b283218f-ea5a-4b7c-93a9-1f2f240d64b0', Type: 'Placement', Message: 'CSX Corporation hiring', Timestamp: '2026-04-22 17:51:18' },
  { ID: '81589ada-0ad3-4f77-9554-f52fb558e09d', Type: 'Event', Message: 'farewell', Timestamp: '2026-04-22 17:51:06' },
  { ID: '0005513a-142b-4bbc-8678-eefec65e1ede', Type: 'Result', Message: 'mid-sem', Timestamp: '2026-04-22 17:50:54' },
  { ID: 'ea836726-c25e-4f21-a72f-544a6af8a37f', Type: 'Result', Message: 'project-review', Timestamp: '2026-04-22 17:50:42' },
  { ID: '003cb427-8fc6-47f7-bb00-be228f6b0d2c', Type: 'Result', Message: 'external', Timestamp: '2026-04-22 17:50:30' },
  { ID: 'e5c4ff20-31bf-4d40-8f02-72fda59e8918', Type: 'Result', Message: 'project-review', Timestamp: '2026-04-22 17:50:18' },
  { ID: '1cfce5ee-ad37-4894-8946-d707627176a5', Type: 'Event', Message: 'tech-fest', Timestamp: '2026-04-22 17:50:06' },
  { ID: 'cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8', Type: 'Result', Message: 'project-review', Timestamp: '2026-04-22 17:49:54' },
  { ID: '8a7412bd-6065-4d09-8501-a37f11cc848b', Type: 'Placement', Message: 'Advanced Micro Devices Inc. hiring', Timestamp: '2026-04-22 17:49:42' }
];

var AUTH_CREDENTIALS = {
  email: 'ramkrishna@abc.edu',
  name: 'ram krishna',
  rollNo: 'aa1bb',
  accessCode: 'xgAsNC',
  clientID: 'd9cbb699-6a27-44a5-8d59-8b1befa816da',
  clientSecret: 'tVJaaaRBSeXcRXeM'
};

function parseNotification(item) {
  return {
    id: item.ID,
    type: item.Type,
    message: item.Message,
    time: new Date(item.Timestamp),
    priority: PRIORITY_MAP[item.Type] || 0
  };
}

function sortNotifications(items) {
  items.sort(function(a, b) {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    if (a.time < b.time) {
      return 1;
    }
    if (a.time > b.time) {
      return -1;
    }
    return 0;
  });
  return items;
}

function showStatus(text, isWarning) {
  var status = document.getElementById('status');
  status.textContent = text;
  if (isWarning) {
    status.className = 'warning';
  } else {
    status.className = '';
  }
}

function showNotifications(items) {
  var container = document.getElementById('output');
  if (items.length === 0) {
    container.textContent = 'No notifications found.';
    return;
  }

  var html = '';
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    html += '<div class="item">';
    html += '<div><strong>' + (i + 1) + '.</strong> <strong>Type:</strong> ' + item.type + '</div>';
    html += '<div><strong>Message:</strong> ' + item.message + '</div>';
    html += '<div><strong>Timestamp:</strong> ' + item.time.toISOString() + '</div>';
    html += '</div>';
  }

  container.innerHTML = html;
}

function getToken(callback) {
  fetch(AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(AUTH_CREDENTIALS)
  }).then(function(response) {
    if (!response.ok) {
      return response.json().then(function(data) {
        callback(new Error(response.status + ' ' + (data.message || response.statusText)));
      }).catch(function() {
        callback(new Error(response.status + ' ' + response.statusText));
      });
    }
    return response.json();
  }).then(function(data) {
    if (!data || !data.access_token) {
      callback(new Error('Auth response missing access_token'));
      return;
    }
    callback(null, data.access_token);
  }).catch(function(error) {
    callback(error);
  });
}

function fetchNotifications(token, callback) {
  fetch(NOTIFICATIONS_URL, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(function(response) {
    if (!response.ok) {
      return response.json().then(function(data) {
        callback(new Error(response.status + ' ' + (data.message || response.statusText)));
      }).catch(function() {
        callback(new Error(response.status + ' ' + response.statusText));
      });
      return;
    }
    return response.json();
  }).then(function(data) {
    callback(null, data.notifications || []);
  }).catch(function(error) {
    callback(error);
  });
}

function showSampleNotifications() {
  var parsed = [];
  for (var i = 0; i < SAMPLE_NOTIFICATIONS.length; i++) {
    parsed.push(parseNotification(SAMPLE_NOTIFICATIONS[i]));
  }
  showNotifications(sortNotifications(parsed).slice(0, TOP_N));
}

function start() {
  showStatus('Loading live notifications...');

  getToken(function(error, token) {
    if (error) {
      showStatus('Live API unavailable: ' + error.message, true);
      showSampleNotifications();
      return;
    }

    fetchNotifications(token, function(error, notifications) {
      if (error) {
        showStatus('Live API unavailable: ' + error.message, true);
        showSampleNotifications();
        return;
      }

      showStatus('Live notifications loaded.');
      var parsed = [];
      for (var i = 0; i < notifications.length; i++) {
        parsed.push(parseNotification(notifications[i]));
      }
      showNotifications(sortNotifications(parsed).slice(0, TOP_N));
    });
  });
}

window.addEventListener('load', start);
