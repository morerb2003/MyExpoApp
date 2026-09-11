const workspaceService = require('./workspaceService');
const AppError = require('../utils/appError');
const TeamMember = require('../models/TeamMember');

class TeamService {
  async getAllMembers(filter = {}) {
    const data = await workspaceService.getWorkspace();
    let team = [...data.team];

    if (filter.status) {
      team = team.filter((m) => m.status.toLowerCase() === filter.status.toLowerCase());
    }

    if (filter.search) {
      const q = filter.search.toLowerCase();
      team = team.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          (m.focus && m.focus.toLowerCase().includes(q))
      );
    }

    return team;
  }

  async getMemberById(id) {
    const data = await workspaceService.getWorkspace();
    const member = data.team.find((m) => m.id === id);
    if (!member) {
      throw AppError.notFound(`Team member with ID '${id}' not found`);
    }
    return member;
  }

  async addMember(memberData) {
    if (!memberData.name || !memberData.role) {
      throw AppError.badRequest('Member name and role are required');
    }

    const member = new TeamMember(memberData);
    const data = await workspaceService.getWorkspace();
    data.team.push(member);
    await workspaceService.saveWorkspace();

    return member;
  }

  async updateMember(id, updateData) {
    const data = await workspaceService.getWorkspace();
    const index = data.team.findIndex((m) => m.id === id);
    if (index === -1) {
      throw AppError.notFound(`Team member with ID '${id}' not found`);
    }

    if (updateData.status && !['online', 'focus', 'away'].includes(updateData.status)) {
      throw AppError.badRequest('Status must be one of: online, focus, away');
    }

    const existing = data.team[index];
    const updated = {
      ...existing,
      ...updateData,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    };

    data.team[index] = updated;
    await workspaceService.saveWorkspace();
    return updated;
  }

  async deleteMember(id) {
    const data = await workspaceService.getWorkspace();
    const index = data.team.findIndex((m) => m.id === id);
    if (index === -1) {
      throw AppError.notFound(`Team member with ID '${id}' not found`);
    }

    const [deleted] = data.team.splice(index, 1);
    await workspaceService.saveWorkspace();
    return deleted;
  }
}

module.exports = new TeamService();
