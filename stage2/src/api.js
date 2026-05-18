const API_URL = 'http://4.224.186.213/evaluation-service/notifications';

const SAMPLE_NOTIFICATIONS = [
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

const PRIORITY_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function buildQuery(params) {
  const queryItems = [];
  if (params.limit) queryItems.push(`limit=${encodeURIComponent(params.limit)}`);
  if (params.page) queryItems.push(`page=${encodeURIComponent(params.page)}`);
  if (params.notification_type && params.notification_type !== 'All') {
    queryItems.push(`notification_type=${encodeURIComponent(params.notification_type)}`);
  }
  return queryItems.length > 0 ? `?${queryItems.join('&')}` : '';
}

function parseApiNotifications(items) {
  return items.map((item) => ({
    id: item.ID,
    type: item.Type,
    message: item.Message,
    time: new Date(item.Timestamp),
    priority: PRIORITY_WEIGHT[item.Type] || 0
  }));
}

function filterSampleData(limit, page, type) {
  let items = SAMPLE_NOTIFICATIONS.slice();
  if (type && type !== 'All') {
    items = items.filter((item) => item.Type === type);
  }
  items = items.sort((a, b) => {
    if (PRIORITY_WEIGHT[b.Type] !== PRIORITY_WEIGHT[a.Type]) {
      return PRIORITY_WEIGHT[b.Type] - PRIORITY_WEIGHT[a.Type];
    }
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });
  const start = (page - 1) * limit;
  return items.slice(start, start + limit).map((item) => ({
    id: item.ID,
    type: item.Type,
    message: item.Message,
    time: new Date(item.Timestamp),
    priority: PRIORITY_WEIGHT[item.Type] || 0
  }));
}

export async function loadNotifications({ limit = 10, page = 1, notification_type = 'All' } = {}) {
  try {
    const response = await fetch(`${API_URL}${buildQuery({ limit, page, notification_type })}`);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || response.statusText);
    }
    const data = await response.json();
    return {
      source: 'api',
      items: parseApiNotifications(data.notifications || []),
      message: 'Live notifications loaded.'
    };
  } catch (error) {
    return {
      source: 'fallback',
      items: filterSampleData(limit, page, notification_type),
      message: 'Live API unavailable: ' + error.message
    };
  }
}

export function sortPriorityNotifications(items) {
  return items
    .slice()
    .sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return b.time - a.time;
    });
}
