const { getUserInfo, isAdmin } = require('../helpers/auth');

module.exports = async function (context, req, event) {
  const eventId = req.params.eventId;
  const pass = req.params.pass;
  const body = req.body;

  if (!eventId || !event || event.deleted) {
    context.log(`Event not found, id=${eventId}`);
    return { status: 404, body: 'Not found' };
  }

  if (event.passes[pass] === undefined) {
    context.log(`Pass not found, pass=${pass}`);
    return { status: 404, body: 'Not found' };
  }

  const userInfo = getUserInfo(req);
  const { userDetails } = userInfo || {};

  if (!userInfo || !userInfo.userId) {
    return { status: 401, body: 'Unauthorized' };
  }

  if (!isAdmin(userDetails, event) || event.archived || event.locked) {
    return { status: 403, body: 'Forbidden' };
  }

  if (!body || body.assign === undefined) {
    return { status: 400, body: 'Body is missing "assign" property' };
  }

  if (Boolean(body.assign)) {
    if (event.passes[pass] !== null) {
      return { status: 400, body: 'Pass already assigned' };
    }

    context.log(`Attributing pass ${pass} manually`);
    event.passes[pass] = '__manually_assigned';
  } else {
    context.log(`Freeing pass ${pass} attribution`);
    event.passes[pass] = null;
  }

  context.log(`Update pass ${pass} attribution`);
  context.bindings.updatedEvent = JSON.stringify(event);

  return { status: 204 };
};
