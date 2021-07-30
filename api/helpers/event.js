const createEvent = (data) => ({
  id: data.id,
  name: data.name,
  date: data.date,
  owner: data.owner,
});

module.exports = {
  createEvent,
};
