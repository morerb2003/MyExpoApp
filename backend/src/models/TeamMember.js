function createTeamMemberModel({
  id = `member-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name,
  initials,
  role = "Team member",
  status = "online",
  color = "#BED8EA",
  project = "General",
  lastActive = "Active now",
}) {
  const cleanName = name.trim();
  const derivedInitials =
    initials ||
    cleanName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return {
    id,
    name: cleanName,
    initials: derivedInitials,
    role: role.trim() || "Team member",
    status: ["online", "focus", "away"].includes(status) ? status : "online",
    color,
    project: project.trim() || "General",
    lastActive,
  };
}

module.exports = {
  createTeamMemberModel,
};
