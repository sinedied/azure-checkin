const { createEvent } = require('../helpers/event');

module.exports = async function (context, req, event) {
  const eventId = req.params.eventId;

  if (!eventId || !event) {
    context.log(`Event not found, id=${eventId}`);
    return { status: 404, body: 'Not found' };
  }

  return {
    body: createEvent(event),
  }
};
