const { getUserInfo, getRole, isAdmin } = require('../helpers/auth');
const { createEventFromEntity } = require('../helpers/event');

module.exports = async function (context, req, events) {
  if (!events) {
    context.log('Could not retrieve events');
    return { status: 404, body: 'Not found' };
  }

  context.log(`Retrieved ${events.length} events`);

  const userInfo = getUserInfo(req);
  const { userDetails } = userInfo || {};

  if (!userInfo || !userInfo.userId) {
    return { status: 401, body: 'Unauthorized' };
  }

  const role = getRole(userDetails);

  if (role !== 'superadmin' && role !== 'admin') {
    return { status: 403, body: 'Forbidden' };
  }

  const showArchived = Boolean(req.query.showArchived) || false;

  const viewableEvents = events
    .filter((event) => isAdmin(userDetails, event, role))
    .filter((event) => !event.deleted && (showArchived || !event.archived))
    .map((event) => createEventFromEntity(event));

  return {
    body: viewableEvents,
  };
};
