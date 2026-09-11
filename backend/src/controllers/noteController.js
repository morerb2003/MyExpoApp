const noteService = require('../services/noteService');
const { ApiResponse } = require('../utils/apiResponse');

class NoteController {
  async getAllNotes(req, res, next) {
    try {
      const { category, search, pinned } = req.query;
      const notes = await noteService.getAllNotes({ category, search, pinned });
      return ApiResponse.success(res, notes, 'Notes retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getNoteById(req, res, next) {
    try {
      const { id } = req.params;
      const note = await noteService.getNoteById(id);
      return ApiResponse.success(res, note, 'Note retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async createNote(req, res, next) {
    try {
      const note = await noteService.createNote(req.body);
      return ApiResponse.created(res, note, 'Note created successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateNote(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await noteService.updateNote(id, req.body);
      return ApiResponse.success(res, updated, 'Note updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async togglePin(req, res, next) {
    try {
      const { id } = req.params;
      const toggled = await noteService.togglePin(id);
      return ApiResponse.success(res, toggled, 'Note pin status toggled successfully');
    } catch (err) {
      next(err);
    }
  }

  async deleteNote(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await noteService.deleteNote(id);
      return ApiResponse.success(res, deleted, 'Note deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NoteController();
