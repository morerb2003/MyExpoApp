function createEventModel({
  id = `event-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title,
  date = new Date().toISOString().slice(0, 10),
  time = "09:00",
  duration = "30m",
  description = "",
  attendees = [],
  color = "#F4B3A3",
}) {
  return {
    id,
    title: title.trim(),
    date,
    time,
    duration,
    description: description.trim(),
    attendees: Array.isArray(attendees) ? attendees : [],
    color,
  };
}

module.exports = {
  createEventModel,
};
