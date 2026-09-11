function createTaskModel({
  id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title,
  description = "",
  priority = "medium",
  dueDate = new Date().toISOString().slice(0, 10),
  status = "todo",
  project = "Personal",
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
}) {
  return {
    id,
    title: title.trim(),
    description: description.trim(),
    priority: ["high", "medium", "low"].includes(priority) ? priority : "medium",
    dueDate,
    status: ["todo", "in-progress", "done"].includes(status) ? status : "todo",
    project: project.trim() || "Personal",
    createdAt,
    updatedAt,
  };
}

module.exports = {
  createTaskModel,
};
