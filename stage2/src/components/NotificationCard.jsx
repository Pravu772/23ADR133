import React from 'react';

function NotificationCard({ notification, viewed, onMarkViewed }) {
  return (
    <article className={viewed ? 'notification-card viewed' : 'notification-card unread'}>
      <div className="card-header">
        <span className={`type-chip type-${notification.type.toLowerCase()}`}>{notification.type}</span>
        <span className={viewed ? 'status viewed-label' : 'status new-label'}>{viewed ? 'Viewed' : 'New'}</span>
      </div>
      <p className="message">{notification.message}</p>
      <div className="card-footer">
        <span>{notification.time.toLocaleString()}</span>
        <button type="button" onClick={() => onMarkViewed(notification.id)}>
          Mark viewed
        </button>
      </div>
    </article>
  );
}

export default NotificationCard;
