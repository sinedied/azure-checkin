const { getUserInfo, getRole } = require('../helpers/auth');
const { createEvent } = require('../helpers/event');

module.exports = async function (context, req, events) {
  if (!events) {
    context.log('Could not retrieve events');
    return { status: 404, body: 'Not found' };
  }

  context.log(`Retrieved ${events.length} events`);

  const userInfo = getUserInfo(req);
  const { userDetails } = userInfo || {};
  const role = getRole(userDetails);

  if (role === 'user') {
    return { status: 403, body: 'Forbidden' };
  }

  const viewableEvents = events
    .filter(
      (event) =>
        role === 'superadmin' ||
        (role === 'admin' && event.owner === userDetails)
    )
    .map((event) => createEvent(event));

  return {
    body: viewableEvents,
  };
};
