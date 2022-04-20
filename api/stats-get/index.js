const { createEventFromEntity } = require('../helpers/event');

module.exports = async function (context, req, events) {
  if (!events) {
    context.log('Could not retrieve events');
    return { status: 404, body: 'Not found' };
  }

  context.log(`Retrieved ${events.length} events`);

  const processableEvents = events.filter((event) => !event.deleted).map((event) => createEventFromEntity(event));

  const stats = {
    eventsCreated: processableEvents.length,
    totalPasses: processableEvents.reduce((total, event) => total + event.totalPasses, 0),
    usedPasses: processableEvents.reduce((total, event) => total + event.usedPasses, 0),
  };

  return {
    body: stats,
  };
};
