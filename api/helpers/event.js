const createEvent = (data, withPasses = false) => ({
  id: data.id,
  name: data.name,
  date: data.date,
  owner: data.owner,
  usedPasses: Object.values(data.passes).filter(hash => hash).length,
  totalPasses: Object.values(data.passes).length,
  ...(withPasses && data.passes || []),
});

module.exports = {
  createEvent,
};
