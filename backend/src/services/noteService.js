const { loadState, saveState, appendActivity } = require("./workspaceService");
const { createNoteModel } = require("../models/Note");
const AppError = require("../utils/appError");

class NoteService {
  async getAllNotes(query = "") {
    const state = loadState();
    let notes = state.notes || [];

    if (query.trim()) {
      const q = query.toLowerCase();
      notes = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)
      );
    }

    return notes;
  }

  async getNoteById(id) {
    const state = loadState();
    const note = (state.notes || []).find((n) => n.id === id);
    if (!note) throw new AppError(`Note with id ${id} not found`, 404);
    return note;
  }

  async createNote(data) {
    const state = loadState();
    const newNote = createNoteModel(data);
    state.notes = [newNote, ...(state.notes || [])];
    appendActivity(state.settings.profileName.split(" ")[0], `captured note “${newNote.title}”`, "yellow");
    saveState();
    return newNote;
  }

  async updateNote(id, patch) {
    const state = loadState();
    const index = (state.notes || []).findIndex((n) => n.id === id);
    if (index === -1) throw new AppError(`Note with id ${id} not found`, 404);

    const updated = {
      ...state.notes[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    state.notes[index] = updated;
    saveState();
    return updated;
  }

  async toggleNotePinned(id) {
    const note = await this.getNoteById(id);
    return this.updateNote(id, { pinned: !note.pinned });
  }

  async deleteNote(id) {
    const state = loadState();
    const index = (state.notes || []).findIndex((n) => n.id === id);
    if (index === -1) throw new AppError(`Note with id ${id} not found`, 404);

    const [removed] = state.notes.splice(index, 1);
    saveState();
    return removed;
  }
}

module.exports = new NoteService();
