const createEvent = (data, withPasses = false) => ({
  id: data.id,
  name: data.name,
  startDate: data.startDate,
  endDate: data.endDate,
  owner: data.owner,
  usedPasses: Object.values(data.passes).filter(hash => hash).length,
  totalPasses: Object.values(data.passes).length,
  ...(withPasses && { passes: data.passes } || {}),
});

module.exports = {
  createEvent,
};
