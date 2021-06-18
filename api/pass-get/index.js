module.exports = async function (context, req, event) {
  const eventId = req.params.eventId;

  if (!eventId || eventId !== 'SWC210622') {
    return { status: 404, body: 'Not found' };
  }

  const token = Buffer.from(
    req.headers['x-ms-client-principal'],
    'base64'
  ).toString('ascii');
  const userInfo = (token && JSON.parse(token)) || null;

  if (!userInfo || !userInfo.userId) {
    return { status: 401, body: 'Unauthorized' };
  }

  context.log(`Requesting pass for user ${userId}`);

  // Get user pass, if not assigned then assign it and return it
  let userPass = Object.keys(
    event.passes.find((pass) => event.passes[pass] === userInfo.userId)
  );

  if (userPass) {
    return { pass: userPass };
  } else {
    context.log(`User ${userId} has not yet a pass attributed`);

    userPass = Object.keys(
      event.passes.find((pass) => event.passes[pass] === null)
    );
    event.passes[userPass] = userInfo.userId;

    context.log(`Attributed pass ${userPass} to user ${userId}`);

    try {
      await event.replace(event, {
        accessCondition: { type: 'IfMatch', condition: event._etag },
      });
    } catch (err) {
      return { status: 409, body: 'Conflict' };
    }

    return { pass: userPass };
  }
};
