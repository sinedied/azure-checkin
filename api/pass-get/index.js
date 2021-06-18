module.exports = async function (context, req, event, client) {
  const eventId = req.params.eventId;

  context.log({client})

  if (!eventId || !event) {
    context.log(`Event not found, id=${eventId}`);
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
  
  const { userId } = userInfo;

  context.log(`Requesting pass for user ${userId}`);

  // Get user pass, if not assigned then assign it and return it
  let userPass = Object.keys(event.passes).find(
    (pass) => event.passes[pass] === userId
  );

  if (!userPass) {
    context.log(`User ${userId} has not yet a pass attributed`);

    userPass = Object.keys(event.passes).find(
      (pass) => event.passes[pass] === null
    );

    if (!userPass) {
      context.log(`No free pass available`);
      return { status: 404, body: 'Not found' };
    }

    event.passes[userPass] = userId;

    context.log(`Attributed pass ${userPass} to user ${userId}`);
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
