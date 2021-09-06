module.exports = async function (context, timer, events) {
  context.log(`Running auto-archive procedure at ${new Date().toISOString()}`);

  if (!events || !events.length) {
    context.log(`No events to archive, aborting`);
    return;
  } else {
    context.log(`Found ${events.length} events to archive`);
    events.forEach((event) => {
      event.locked = true;
      event.archived = true;
    });
    context.bindings.updatedEvents = events;

    context.log(`Archived ${events.length} events successfully`);
  }

  context.done();
};
