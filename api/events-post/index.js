const { getUserInfo, isAdmin } = require('../helpers/auth');
const {
  createEventFromEntity,
  createEntityFromEvent,
} = require('../helpers/event');

const idPatternRegex = /^[a-z]{3}[0-9]{6}$/;

module.exports = async function (context, req, existingEvent) {
  const event = req.body;

  if (
    !event ||
    !event.id ||
    !event.name ||
    !event.startDate ||
    !event.endDate ||
    !event.passes
  ) {
    return {
      status: 400,
      body: 'Missing one or more required fields',
    };
  }

  if (!idPatternRegex.test(event.id)) {
    return {
      status: 400,
      body: 'Invalid event ID',
    };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  if (yesterday > new Date(event.startDate)) {
    return {
      status: 400,
      body: 'Event start date must be in the future',
    };
  }

  if (new Date(event.startDate) > new Date(event.endDate)) {
    return {
      status: 400,
      body: 'Start date must be before end date',
    };
  }

  if (!Array.isArray(event.passes) || event.passes.length === 0) {
    return {
      status: 400,
      body: 'Event must have at least one pass',
    };
  }

  if (existingEvent) {
    return {
      status: 409,
      body: `Event ID ${event.id} already exists`,
    };
  }

  const userInfo = getUserInfo(req);
  const { userDetails } = userInfo || {};

  if (!isAdmin(userDetails, event)) {
    return { status: 403, body: 'Forbidden' };
  }

  const newEvent = createEntityFromEvent(event, userDetails);
  context.bindings.newEvent = JSON.stringify(newEvent);
  context.log(`Created new event ${newEvent.id}`);

  return {
    body: createEventFromEntity(newEvent),
  };
};
