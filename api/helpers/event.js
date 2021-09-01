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

const createEntityFromEvent = (event, owner) => ({
  id: event.id,
  owner,
  name: event.name,
  startDate: event.startDate,
  endDate: event.endDate,
  passes: Object.fromEntries(event.passes.map((pass) => [pass, null])),
  locked: false,
  archived: false,
  deleted: false,
});

function updateEntityFromData(eventEntity, data) {
  const updatedEvent = { ...eventEntity };

  if (data.name !== undefined) {
    updatedEvent.name = data.name;
  }

  if (data.startDate !== undefined) {
    updatedEvent.startDate = data.startDate;
  }

  if (data.endDate !== undefined) {
    updatedEvent.endDate = data.endDate;
  }

  if (data.passes !== undefined) {
    const newPasses = Object.fromEntries(
      data.passes.filter((pass) => eventEntity.passes[pass] === undefined).map((pass) => [pass, null])
    );
    updatedEvent.passes = { ...eventEntity.passes, ...newPasses };
  }

  if (data.locked !== undefined) {
    updatedEvent.locked = Boolean(data.locked);
  }

  if (data.archived !== undefined) {
    updatedEvent.archived = Boolean(data.archived);

    // An archived event is also locked and cannot be modified
    if (updatedEvent.archived) {
      updatedEvent.locked = true;
    }
  }

  return updatedEvent;
}

module.exports = {
  createEventFromEntity,
  createEntityFromEvent,
  updateEntityFromData,
};
