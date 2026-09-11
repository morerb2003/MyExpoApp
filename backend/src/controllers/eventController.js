const eventService = require('../services/eventService');
const { ApiResponse } = require('../utils/apiResponse');

class EventController {
  async getAllEvents(req, res, next) {
    try {
      const { category, date, startDate, endDate } = req.query;
      const events = await eventService.getAllEvents({ category, date, startDate, endDate });
      return ApiResponse.success(res, events, 'Events retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getEventById(req, res, next) {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);
      return ApiResponse.success(res, event, 'Event retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async createEvent(req, res, next) {
    try {
      const event = await eventService.createEvent(req.body);
      return ApiResponse.created(res, event, 'Event created successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await eventService.updateEvent(id, req.body);
      return ApiResponse.success(res, updated, 'Event updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async deleteEvent(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await eventService.deleteEvent(id);
      return ApiResponse.success(res, deleted, 'Event deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new EventController();
