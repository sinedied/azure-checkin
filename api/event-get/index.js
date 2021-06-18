module.exports = async function (context, req, event) {
  const eventId = req.params.eventId;

  if (!eventId || !event) {
    context.log(`Event not found, id=${eventId}`);
    return { status: 404, body: 'Not found' };
  }

  context.log(event);

  return {
    body: {
      id: event.id,
      name: event.name,
      date: event.date,
  
      // if (user.role === 'admin')
      // passes: passesMap,
    }
  };
};
