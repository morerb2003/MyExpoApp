const { loadState, saveState, appendActivity } = require("./workspaceService");
const { createTaskModel } = require("../models/Task");
const AppError = require("../utils/appError");

class TaskService {
  async getAllTasks(filter = {}) {
    const state = loadState();
    let tasks = state.tasks || [];

    if (filter.status) {
      tasks = tasks.filter((t) => t.status === filter.status);
    }
    if (filter.priority) {
      tasks = tasks.filter((t) => t.priority === filter.priority);
    }
    if (filter.project) {
      tasks = tasks.filter((t) => t.project.toLowerCase() === filter.project.toLowerCase());
    }

    return tasks;
  }

  async getTaskById(id) {
    const state = loadState();
    const task = (state.tasks || []).find((t) => t.id === id);
    if (!task) throw new AppError(`Task with id ${id} not found`, 404);
    return task;
  }

  async createTask(data) {
    const state = loadState();
    const newTask = createTaskModel(data);
    state.tasks = [newTask, ...(state.tasks || [])];
    appendActivity(state.settings.profileName.split(" ")[0], `created task “${newTask.title}”`, "coral");
    saveState();
    return newTask;
  }

  async updateTask(id, patch) {
    const state = loadState();
    const index = (state.tasks || []).findIndex((t) => t.id === id);
    if (index === -1) throw new AppError(`Task with id ${id} not found`, 404);

    const updated = {
      ...state.tasks[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    state.tasks[index] = updated;
    saveState();
    return updated;
  }

  async toggleTaskStatus(id) {
    const task = await this.getTaskById(id);
    const nextStatus = task.status === "done" ? "todo" : "done";
    const updated = await this.updateTask(id, { status: nextStatus });
    if (nextStatus === "done") {
      const state = loadState();
      appendActivity(state.settings.profileName.split(" ")[0], `completed “${task.title}”`, "mint");
    }
    return updated;
  }

  async deleteTask(id) {
    const state = loadState();
    const index = (state.tasks || []).findIndex((t) => t.id === id);
    if (index === -1) throw new AppError(`Task with id ${id} not found`, 404);

    const [removed] = state.tasks.splice(index, 1);
    appendActivity(state.settings.profileName.split(" ")[0], `removed task “${removed.title}”`, "neutral");
    saveState();
    return removed;
  }
}

module.exports = new TaskService();
