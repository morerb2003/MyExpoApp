const workspaceService = require('../services/workspaceService');
const { ApiResponse } = require('../utils/apiResponse');

class WorkspaceController {
  async getWorkspace(req, res, next) {
    try {
      const data = await workspaceService.getWorkspace();
      return ApiResponse.success(res, data, 'Workspace state loaded successfully');
    } catch (err) {
      next(err);
    }
  }

  async getDashboardSummary(req, res, next) {
    try {
      const data = await workspaceService.getWorkspace();
      const totalTasks = data.tasks.length;
      const completedTasks = data.tasks.filter((t) => t.status === 'completed').length;
      const inProgressTasks = data.tasks.filter((t) => t.status === 'in-progress').length;
      const todoTasks = data.tasks.filter((t) => t.status === 'todo').length;

      const onlineMembers = data.team.filter((m) => m.status === 'online').length;
      const focusMembers = data.team.filter((m) => m.status === 'focus').length;
      const totalMembers = data.team.length;

      const pinnedNotes = data.notes.filter((n) => n.isPinned).length;
      const totalNotes = data.notes.length;

      const today = new Date().toISOString().split('T')[0];
      const todayEvents = data.events.filter((e) => e.date === today);

      const summary = {
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          inProgress: inProgressTasks,
          todo: todoTasks,
          completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
        team: {
          total: totalMembers,
          online: onlineMembers,
          focus: focusMembers,
        },
        notes: {
          total: totalNotes,
          pinned: pinnedNotes,
        },
        events: {
          total: data.events.length,
          todayCount: todayEvents.length,
          todayEvents,
        },
        settings: data.settings,
      };

      return ApiResponse.success(res, summary, 'Dashboard summary calculated successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const settings = await workspaceService.updateSettings(req.body);
      return ApiResponse.success(res, settings, 'Workspace settings updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async resetWorkspace(req, res, next) {
    try {
      const fresh = await workspaceService.resetWorkspace();
      return ApiResponse.success(res, fresh, 'Workspace reset to default seed data successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new WorkspaceController();
