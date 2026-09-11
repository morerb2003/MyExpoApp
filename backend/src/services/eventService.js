const workspaceService = require('./workspaceService');
const AppError = require('../utils/appError');
const Event = require('../models/Event');

class EventService {
  async getAllEvents(filter = {}) {
    const data = await workspaceService.getWorkspace();
    let events = [...data.events];

    if (filter.category) {
      events = events.filter((e) => e.category?.toLowerCase() === filter.category.toLowerCase());
    }

    if (filter.startDate && filter.endDate) {
      events = events.filter((e) => e.date >= filter.startDate && e.date <= filter.endDate);
    } else if (filter.date) {
      events = events.filter((e) => e.date === filter.date);
    }

    events.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    return events;
  }

  async getEventById(id) {
    const data = await workspaceService.getWorkspace();
    const event = data.events.find((e) => e.id === id);
    if (!event) {
      throw AppError.notFound(`Event with ID '${id}' not found`);
    }
    return event;
  }

  async createEvent(eventData) {
    if (!eventData.title || !eventData.date || !eventData.time) {
      throw AppError.badRequest('Title, date, and time are required for an event');
    }

    const newEvent = new Event(eventData);
    const data = await workspaceService.getWorkspace();
    data.events.push(newEvent);
    await workspaceService.saveWorkspace();

    return newEvent;
  }

  async updateEvent(id, updateData) {
    const data = await workspaceService.getWorkspace();
    const index = data.events.findIndex((e) => e.id === id);
    if (index === -1) {
      throw AppError.notFound(`Event with ID '${id}' not found`);
    }

    const existing = data.events[index];
    const updated = {
      ...existing,
      ...updateData,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    };

    data.events[index] = updated;
    await workspaceService.saveWorkspace();
    return updated;
  }

  async deleteEvent(id) {
    const data = await workspaceService.getWorkspace();
    const index = data.events.findIndex((e) => e.id === id);
    if (index === -1) {
      throw AppError.notFound(`Event with ID '${id}' not found`);
    }

    const [deleted] = data.events.splice(index, 1);
    await workspaceService.saveWorkspace();
    return deleted;
  }
}

module.exports = new EventService();
