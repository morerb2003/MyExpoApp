const teamService = require('../services/teamService');
const { ApiResponse } = require('../utils/apiResponse');

class TeamController {
  async getAllMembers(req, res, next) {
    try {
      const { status, search } = req.query;
      const team = await teamService.getAllMembers({ status, search });
      return ApiResponse.success(res, team, 'Team members retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getMemberById(req, res, next) {
    try {
      const { id } = req.params;
      const member = await teamService.getMemberById(id);
      return ApiResponse.success(res, member, 'Team member retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async addMember(req, res, next) {
    try {
      const member = await teamService.addMember(req.body);
      return ApiResponse.created(res, member, 'Team member added successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateMember(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await teamService.updateMember(id, req.body);
      return ApiResponse.success(res, updated, 'Team member updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async deleteMember(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await teamService.deleteMember(id);
      return ApiResponse.success(res, deleted, 'Team member deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TeamController();
