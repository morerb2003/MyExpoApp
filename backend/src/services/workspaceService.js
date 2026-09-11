const fs = require("fs");
const { DB_FILE, connectDB } = require("../config/db");
const { createDefaultWorkspace } = require("../models/Workspace");

let memoryState = null;

function loadState() {
  if (memoryState) return memoryState;
  connectDB();
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      memoryState = JSON.parse(raw);
    } else {
      memoryState = createDefaultWorkspace();
      saveState();
    }
  } catch (err) {
    console.warn("[WorkspaceService] Could not read db file, initializing default:", err.message);
    memoryState = createDefaultWorkspace();
    saveState();
  }
  return memoryState;
}

function saveState() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryState, null, 2), "utf-8");
  } catch (err) {
    console.error("[WorkspaceService] Error saving state:", err.message);
  }
}

function appendActivity(actor, message, tone = "neutral") {
  const state = loadState();
  const activity = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actor: actor || state.settings.profileName.split(" ")[0] || "You",
    message,
    timestamp: "Just now",
    tone,
  };
  state.activities = [activity, ...(state.activities || [])].slice(0, 30);
  saveState();
  return activity;
}

class WorkspaceService {
  async getWorkspace() {
    return loadState();
  }

  async updateSettings(patch) {
    const state = loadState();
    state.settings = { ...state.settings, ...patch };
    saveState();
    return state.settings;
  }

  async recordFocusMinutes(minutes) {
    const state = loadState();
    state.focusMinutes = (state.focusMinutes || 0) + minutes;
    appendActivity(state.settings.profileName.split(" ")[0], `completed a ${minutes}m focus session`, "yellow");
    saveState();
    return { focusMinutes: state.focusMinutes };
  }

  async resetWorkspace() {
    memoryState = createDefaultWorkspace();
    saveState();
    return memoryState;
  }

  async getActivities() {
    const state = loadState();
    return state.activities || [];
  }
}

module.exports = {
  workspaceService: new WorkspaceService(),
  loadState,
  saveState,
  appendActivity,
};
