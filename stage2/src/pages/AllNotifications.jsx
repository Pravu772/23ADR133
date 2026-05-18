import React, { useEffect, useState } from 'react';
import NotificationCard from '../components/NotificationCard';
import { loadNotifications } from '../api';
import { getViewedIds, markAsViewed } from '../utils';

const TYPE_OPTIONS = ['All', 'Event', 'Result', 'Placement'];
const LIMIT_OPTIONS = [10, 15, 20];

function AllNotifications() {
  const [notificationType, setNotificationType] = useState('All');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [statusMessage, setStatusMessage] = useState('Loading notifications...');
  const [sourceLabel, setSourceLabel] = useState('live');
  const [viewedIds, setViewedIds] = useState(getViewedIds());

  useEffect(() => {
    setStatusMessage('Loading notifications...');
    loadNotifications({ limit, page, notification_type: notificationType }).then((result) => {
      setNotifications(result.items);
      setSourceLabel(result.source);
      setStatusMessage(result.message);
    });
  }, [limit, page, notificationType]);

  function handleMarkViewed(id) {
    markAsViewed(id);
    setViewedIds(getViewedIds());
  }

  function handlePreviousPage() {
    setPage((current) => Math.max(current - 1, 1));
  }

  function handleNextPage() {
    setPage((current) => current + 1);
  }

  return (
    <section className="page-shell">
      <div className="page-intro">
        <div>
          <h2>All Notifications</h2>
          <p>Browse every notification and apply filters by type and list size.</p>
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
            <select value={limit} onChange={(event) => setLimit(Number(event.target.value))}>
              {LIMIT_OPTIONS.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Page
            <input
              type="number"
              min="1"
              value={page}
              onChange={(event) => setPage(Math.max(1, Number(event.target.value) || 1))}
            />
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

      <div className="pagination-row">
        <button type="button" onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button type="button" onClick={handleNextPage}>
          Next
        </button>
      </div>
    </section>
  );
}

export default AllNotifications;
