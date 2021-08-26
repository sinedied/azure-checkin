const createEventFromEntity = (data, withPasses = false) => ({
  id: data.id,
  name: data.name,
  startDate: data.startDate,
  endDate: data.endDate,
  owner: data.owner,
  locked: data.locked,
  archived: data.archived,
  usedPasses: Object.values(data.passes).filter((hash) => hash).length,
  totalPasses: Object.values(data.passes).length,
  ...((withPasses && { passes: data.passes }) || {}),
});

const createEntityFromEvent = (event) => ({
  id: event.id,
  name: event.name,
  startDate: event.startDate,
  endDate: event.endDate,
  passes: event.passes,
  locked: false,
  archived: false,
  deleted: false,
});

module.exports = {
  createEventFromEntity,
  createEntityFromEvent,
};
