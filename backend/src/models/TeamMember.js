class TeamMember {
  constructor({
    id = `member-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name = '',
    initials,
    role = 'Team member',
    status = 'online',
    color = '#BED8EA',
    project = 'General',
    lastActive = 'Active now',
    focus = '',
  } = {}) {
    const cleanName = (name || '').trim();
    const derivedInitials =
      initials ||
      cleanName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    this.id = id;
    this.name = cleanName;
    this.initials = derivedInitials;
    this.role = (role || '').trim() || 'Team member';
    this.status = ['online', 'focus', 'away'].includes(status) ? status : 'online';
    this.color = color;
    this.project = (project || '').trim() || 'General';
    this.lastActive = lastActive;
    this.focus = focus;
  }
}

function createTeamMemberModel(data) {
  return new TeamMember(data);
}

TeamMember.createTeamMemberModel = createTeamMemberModel;
module.exports = TeamMember;
