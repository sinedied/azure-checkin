const { getUserInfo, isAdmin } = require('../helpers/auth');
const { updateEntityFromData, createEventFromEntity } = require('../helpers/event');

module.exports = async function (context, req, event) {
  const eventId = req.params.eventId;
  const data = req.body;

  if (!eventId || !event) {
    context.log(`Event not found, id=${eventId}`);
    return { status: 404, body: 'Not found' };
  }

  const userInfo = getUserInfo(req);
  const { userDetails } = userInfo || {};

  if (!userInfo || !userInfo.userId) {
    return { status: 401, body: 'Unauthorized' };
  }

  if (!isAdmin(userDetails, event)) {
    return { status: 403, body: 'Forbidden' };
  }

  if (!data) {
    return { status: 400, body: 'Body is missing' };
  }

  if (data.deleted !== undefined) {
    return { status: 400, body: 'Bad parameters' };
  }

  if (data.id !== undefined) {
    return { status: 400, body: 'Id cannot be changed' };
  }

  if (data.owner !== undefined) {
    return { status: 400, body: 'Owner cannot be changed' };
  }

  if (data.name !== undefined && !data.name) {
    return { status: 400, body: 'Name cannot be empty' };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const minDate = yesterday < new Date(event.startDate) ? yesterday : new Date(event.startDate);

  if (data.startDate !== undefined && minDate > new Date(data.startDate)) {
    return {
      status: 400,
      body: 'Event start date must be in the future or not before previous start date',
    };
  }

  if (data.startDate !== undefined && new Date(data.startDate) > new Date(data.endDate)) {
    return {
      status: 400,
      body: 'Start date must be before end date',
    };
  }

  if (data.passes !== undefined && !Array.isArray(data.passes)) {
    return {
      status: 400,
      body: 'Event must have at least one pass to add',
    };
  }

  context.log(event);

  if (
    (event.archived || event.locked) &&
    (data.name !== undefined || data.startDate !== undefined || data.endDate !== undefined || data.passes !== undefined)
  ) {
    return {
      status: 400,
      body: 'Event is locked and cannot be modified',
    };
  }

  const updatedEvent = updateEntityFromData(event, data);
  context.bindings.updatedEvent = JSON.stringify(updatedEvent);

  context.log(`Updated event ${eventId}`);

  return { body: createEventFromEntity(updatedEvent) };
};
