module.exports = async function (context, events) {
  context.log(`Running autolock procedure at ${new Date().toISOString()}`);

  if (!events || !events.length) {
    context.log(`No events to lock, aborting`);
    return;
  } else {
    context.log(`Found ${events.length} events to lock`);
    events.forEach((event) => {
      event.locked = true;
    });
    context.bindings.updatedEvents = events;

    context.log(`Locked ${events.length} events successfully`);
  }

  context.done();
};
