class Event {
  constructor({
    id = `event-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title = '',
    date = new Date().toISOString().slice(0, 10),
    time = '09:00',
    duration = '30m',
    description = '',
    attendees = [],
    color = '#F4B3A3',
    category = 'General',
  } = {}) {
    this.id = id;
    this.title = (title || '').trim();
    this.date = date;
    this.time = time;
    this.duration = duration;
    this.description = (description || '').trim();
    this.attendees = Array.isArray(attendees) ? attendees : [];
    this.color = color;
    this.category = category;
  }
}

function createEventModel(data) {
  return new Event(data);
}

Event.createEventModel = createEventModel;
module.exports = Event;
