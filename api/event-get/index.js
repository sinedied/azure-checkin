const { getUserInfo, getRole } = require('../helpers/auth');
const { createEvent } = require('../helpers/event');

module.exports = async function (context, req, event) {
  const eventId = req.params.eventId;
  const withPasses = Boolean(req.query.withPasses);

  if (!eventId || !event) {
    context.log(`Event not found, id=${eventId}`);
    return { status: 404, body: 'Not found' };
  }

  if (withPasses) {
    const userInfo = getUserInfo(req);
    const { userDetails } = userInfo || {};
    const role = getRole(userDetails);

    if (role === 'user') {
      return { status: 403, body: 'Forbidden' };
    }
  }

  return {
    body: createEvent(event, withPasses),
  };
};
