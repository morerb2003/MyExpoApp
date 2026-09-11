const taskService = require('../services/taskService');
const { ApiResponse } = require('../utils/apiResponse');

class TaskController {
  async getAllTasks(req, res, next) {
    try {
      const { status, priority, category, search } = req.query;
      const tasks = await taskService.getAllTasks({ status, priority, category, search });
      return ApiResponse.success(res, tasks, 'Tasks retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);
      return ApiResponse.success(res, task, 'Task retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(req.body);
      return ApiResponse.created(res, task, 'Task created successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await taskService.updateTask(id, req.body);
      return ApiResponse.success(res, updated, 'Task updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async toggleTask(req, res, next) {
    try {
      const { id } = req.params;
      const toggled = await taskService.toggleTask(id);
      return ApiResponse.success(res, toggled, 'Task status toggled successfully');
    } catch (err) {
      next(err);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await taskService.deleteTask(id);
      return ApiResponse.success(res, deleted, 'Task deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TaskController();
