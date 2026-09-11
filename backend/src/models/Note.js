function createNoteModel({
  id = `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title,
  body = "",
  category = "Ideas",
  color = "#F4D98B",
  pinned = false,
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
}) {
  return {
    id,
    title: title.trim(),
    body: body.trim(),
    category: category.trim() || "Ideas",
    color,
    pinned: Boolean(pinned),
    createdAt,
    updatedAt,
  };
}

module.exports = {
  createNoteModel,
};
