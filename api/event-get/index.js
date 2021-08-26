const { getUserInfo, getRole, isAdmin } = require('../helpers/auth');
const { createEventFromEntity } = require('../helpers/event');

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

    if (!isAdmin(userDetails, event)) {
      return { status: 403, body: 'Forbidden' };
    }
  }

  return {
    body: createEventFromEntity(event, withPasses),
  };
};
