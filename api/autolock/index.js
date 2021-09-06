module.exports = async function (context, timer, events) {
  context.log(`Running auto-lock procedure at ${new Date().toISOString()}`);

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
