const STORAGE_KEY = 'stage2_viewed_notification_ids';

export function getViewedIds() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

export function markAsViewed(id) {
  const existing = getViewedIds();
  if (!existing.includes(id)) {
    existing.push(id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }
}

export function isViewed(id) {
  return getViewedIds().includes(id);
}
