const workspaceService = require('./workspaceService');
const { createTaskModel } = require('../models/Task');
const AppError = require('../utils/appError');

class TaskService {
  async getAllTasks(filter = {}) {
    const state = workspaceService.loadState();
    let tasks = [...(state.tasks || [])];

    if (filter.status) {
      tasks = tasks.filter((t) => t.status === filter.status);
    }
    if (filter.priority) {
      tasks = tasks.filter((t) => t.priority === filter.priority);
    }
    if (filter.category) {
      tasks = tasks.filter(
        (t) => (t.category && t.category.toLowerCase() === filter.category.toLowerCase()) ||
               (t.project && t.project.toLowerCase() === filter.category.toLowerCase())
      );
    }
    if (filter.project) {
      tasks = tasks.filter((t) => t.project && t.project.toLowerCase() === filter.project.toLowerCase());
    }
    if (filter.search && filter.search.trim()) {
      const q = filter.search.trim().toLowerCase();
      tasks = tasks.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    return tasks;
  }

  async getTaskById(id) {
    const state = workspaceService.loadState();
    const task = (state.tasks || []).find((t) => t.id === id);
    if (!task) throw new AppError(`Task with id ${id} not found`, 404);
    return task;
  }

  async createTask(data) {
    const state = workspaceService.loadState();
    const newTask = createTaskModel(data);
    state.tasks = [newTask, ...(state.tasks || [])];
    const profileName = state.settings?.profileName || 'You';
    workspaceService.appendActivity(profileName.split(' ')[0], `created task “${newTask.title}”`, 'coral');
    workspaceService.saveState();
    return newTask;
  }

  async updateTask(id, patch) {
    const state = workspaceService.loadState();
    const index = (state.tasks || []).findIndex((n) => n.id === id);
    if (index === -1) throw new AppError(`Task with id ${id} not found`, 404);

    const updated = {
      ...state.tasks[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    state.tasks[index] = updated;
    workspaceService.saveState();
    return updated;
  }

  async toggleTask(id) {
    const task = await this.getTaskById(id);
    const nextStatus = task.status === 'completed' || task.status === 'done' ? 'todo' : 'completed';
    const updated = await this.updateTask(id, { status: nextStatus });
    if (nextStatus === 'completed') {
      const profileName = workspaceService.loadState().settings?.profileName || 'You';
      workspaceService.appendActivity(profileName.split(' ')[0], `completed “${task.title}”`, 'mint');
    }
    return updated;
  }

  async toggleTaskStatus(id) {
    return this.toggleTask(id);
  }

  async deleteTask(id) {
    const state = workspaceService.loadState();
    const index = (state.tasks || []).findIndex((t) => t.id === id);
    if (index === -1) throw new AppError(`Task with id ${id} not found`, 404);

    const [removed] = state.tasks.splice(index, 1);
    const profileName = state.settings?.profileName || 'You';
    workspaceService.appendActivity(profileName.split(' ')[0], `removed task “${removed.title}”`, 'neutral');
    workspaceService.saveState();
    return removed;
  }
}

module.exports = new TaskService();
