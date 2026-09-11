const workspaceService = require('./workspaceService');
const { createNoteModel } = require('../models/Note');
const AppError = require('../utils/appError');

class NoteService {
  async getAllNotes(filter = {}) {
    const state = workspaceService.loadState();
    let notes = [...(state.notes || [])];

    let search = '';
    let category = null;
    let pinned = null;

    if (typeof filter === 'string') {
      search = filter;
    } else if (filter && typeof filter === 'object') {
      search = filter.search || '';
      category = filter.category || null;
      pinned = filter.pinned !== undefined ? filter.pinned : null;
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      notes = notes.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(q)) ||
          (n.body && n.body.toLowerCase().includes(q)) ||
          (n.content && n.content.toLowerCase().includes(q)) ||
          (n.category && n.category.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All') {
      notes = notes.filter((n) => n.category && n.category.toLowerCase() === category.toLowerCase());
    }

    if (pinned !== null && pinned !== undefined) {
      const isPinned = pinned === 'true' || pinned === true;
      notes = notes.filter((n) => !!(n.isPinned || n.pinned) === isPinned);
    }

    return notes;
  }

  async getNoteById(id) {
    const state = workspaceService.loadState();
    const note = (state.notes || []).find((n) => n.id === id);
    if (!note) throw new AppError(`Note with id ${id} not found`, 404);
    return note;
  }

  async createNote(data) {
    const state = workspaceService.loadState();
    const newNote = createNoteModel(data);
    state.notes = [newNote, ...(state.notes || [])];
    const profileName = state.settings?.profileName || 'You';
    workspaceService.appendActivity(profileName.split(' ')[0], `captured note “${newNote.title}”`, 'yellow');
    workspaceService.saveState();
    return newNote;
  }

  async updateNote(id, patch) {
    const state = workspaceService.loadState();
    const index = (state.notes || []).findIndex((n) => n.id === id);
    if (index === -1) throw new AppError(`Note with id ${id} not found`, 404);

    const updated = {
      ...state.notes[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    state.notes[index] = updated;
    workspaceService.saveState();
    return updated;
  }

  async togglePin(id) {
    const note = await this.getNoteById(id);
    const currentPinned = !!(note.isPinned !== undefined ? note.isPinned : note.pinned);
    return this.updateNote(id, {
      isPinned: !currentPinned,
      pinned: !currentPinned,
    });
  }

  async toggleNotePinned(id) {
    return this.togglePin(id);
  }

  async deleteNote(id) {
    const state = workspaceService.loadState();
    const index = (state.notes || []).findIndex((n) => n.id === id);
    if (index === -1) throw new AppError(`Note with id ${id} not found`, 404);

    const [removed] = state.notes.splice(index, 1);
    workspaceService.saveState();
    return removed;
  }
}

module.exports = new NoteService();
