import React, { useEffect, useState } from 'react';
import NotificationCard from '../components/NotificationCard';
import { loadNotifications, sortPriorityNotifications } from '../api';
import { getViewedIds, markAsViewed } from '../utils';

const TYPE_OPTIONS = ['All', 'Event', 'Result', 'Placement'];
const TOP_OPTIONS = [10, 15, 20];

function PriorityNotifications() {
  const [notificationType, setNotificationType] = useState('All');
  const [topN, setTopN] = useState(10);
  const [notifications, setNotifications] = useState([]);
  const [statusMessage, setStatusMessage] = useState('Loading priority notifications...');
  const [sourceLabel, setSourceLabel] = useState('live');
  const [viewedIds, setViewedIds] = useState(getViewedIds());

  useEffect(() => {
    setStatusMessage('Loading priority notifications...');
    loadNotifications({ limit: 50, page: 1, notification_type: notificationType }).then((result) => {
      const sorted = sortPriorityNotifications(result.items).slice(0, topN);
      setNotifications(sorted);
      setSourceLabel(result.source);
      setStatusMessage(result.message);
    });
  }, [notificationType, topN]);

  function handleMarkViewed(id) {
    markAsViewed(id);
    setViewedIds(getViewedIds());
  }

  return (
    <section className="page-shell">
      <div className="page-intro">
        <div>
          <h2>Priority Inbox</h2>
          <p>This view shows the highest priority notifications first, with a focus on Placement and Result updates.</p>
        </div>
        <div className="filters-row">
          <label>
            Type
            <select value={notificationType} onChange={(event) => setNotificationType(event.target.value)}>
              {TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            Top
            <select value={topN} onChange={(event) => setTopN(Number(event.target.value))}>
              {TOP_OPTIONS.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="status-panel">
        <span>{statusMessage}</span>
        <span className="source-chip">Source: {sourceLabel === 'api' ? 'Live API' : 'Fallback sample data'}</span>
      </div>

      <div className="notification-grid">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            viewed={viewedIds.includes(notification.id)}
            onMarkViewed={handleMarkViewed}
          />
        ))}
      </div>
    </section>
  );
}

export default PriorityNotifications;
