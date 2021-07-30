const { getUserInfo } = require('../helpers/auth');
const { createEvent } = require('../helpers/event');
const administrators = require('../administrators.json');

module.exports = async function (context, req, events) {
  if (!events) {
    context.log('Could not retrieve events');
    return { status: 404, body: 'Not found' };
  }

  context.log(`Retrieved ${events.length} events`);

  const userInfo = getUserInfo(req);
  const { userDetails } = userInfo || {};
  const role =
    (userDetails && administrators[userDetails.toLowerCase()]) || 'user';

  if (role === 'user') {
    return { status: 401, body: 'Unauthorized' };
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
