const crypto = require('crypto');
const { getUserInfo } = require('../helpers/auth');

module.exports = async function (context, req, event, client) {
  const eventId = req.params.eventId;

  context.log({ client });

  if (!eventId || !event) {
    context.log(`Event not found, id=${eventId}`);
    return { status: 404, body: 'Not found' };
  }

  const userInfo = getUserInfo(req);

  if (!userInfo || !userInfo.userId) {
    return { status: 401, body: 'Unauthorized' };
  }

  const { userId } = userInfo;
  const hash = crypto.createHash('sha256').update(userId).digest('base64');

  context.log(`Requesting pass for user hash ${hash}`);

  // Get user pass, if not assigned then assign it and return it
  let userPass = Object.keys(event.passes).find(
    (pass) => event.passes[pass] === hash
  );

  if (!userPass) {
    context.log(`User hash ${hash} has not yet a pass attributed`);

    userPass = Object.keys(event.passes).find(
      (pass) => event.passes[pass] === null
    );

    if (!userPass) {
      context.log(`No free pass available`);
      return { status: 404, body: 'Not found' };
    }

    event.passes[userPass] = hash;

    context.log(`Attributed pass ${userPass} to user hash ${hash}`);
    context.bindings.updatedEvent = JSON.stringify(event);

    // try {
    //   await event.replace(event, {
    //     accessCondition: { type: 'IfMatch', condition: event._etag },
    //   });
    // } catch (err) {
    //   context.log(err);
    //   context.log(`Event etag ${event._etag} does not match!`);
    //   return { status: 409, body: 'Conflict' };
    // }
  } else {
    context.log(`Found attributed pass ${userPass}`);
  }

  return {
    body: { pass: userPass },
  };
};
