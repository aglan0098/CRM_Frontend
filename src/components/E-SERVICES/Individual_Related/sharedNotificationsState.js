// Shared state for removed notifications across components
let globalRemovedNotifications = [];

export const getRemovedNotifications = () => globalRemovedNotifications;

export const setRemovedNotifications = (removedIds) => {
  globalRemovedNotifications = removedIds;
  console.log('🔄 Global removed notifications updated:', globalRemovedNotifications);
};

export const addRemovedNotification = (id) => {
  if (!globalRemovedNotifications.includes(id)) {
    globalRemovedNotifications = [...globalRemovedNotifications, id];
    console.log('🔄 Added removed notification:', id, 'Total:', globalRemovedNotifications);
  }
};

export const addAllRemovedNotifications = (ids) => {
  const newIds = ids.filter(id => !globalRemovedNotifications.includes(id));
  globalRemovedNotifications = [...globalRemovedNotifications, ...newIds];
  console.log('🔄 Added all removed notifications:', ids, 'Total:', globalRemovedNotifications);
};
