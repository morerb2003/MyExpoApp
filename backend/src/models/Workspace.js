function createDefaultWorkspace() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  return {
    version: 1,
    settings: {
      profileName: "Alex Rivera",
      email: "alex@studio.co",
      appearance: "system",
      notifications: true,
      language: "English",
      dailyDigest: true,
    },
    focusMinutes: 270,
    tasks: [
      {
        id: "task-1",
        title: "Finalize Q3 launch plan",
        description: "Align milestones, owners, and risk plan before team review.",
        priority: "high",
        dueDate: today,
        status: "in-progress",
        project: "Product",
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: "task-2",
        title: "Send research synthesis",
        description: "Turn interview takeaways into a concise decision memo.",
        priority: "medium",
        dueDate: today,
        status: "todo",
        project: "Research",
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ],
    notes: [
      {
        id: "note-1",
        title: "Launch notes",
        body: "The clearest value is the calm, focused workspace—not more process.",
        category: "Product",
        color: "#F4B3A3",
        pinned: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ],
    events: [
      {
        id: "event-1",
        title: "Deep work block",
        date: today,
        time: "09:00",
        duration: "2h",
        description: "Protect time for focused execution.",
        attendees: [],
        color: "#F4B3A3",
      },
    ],
    team: [
      {
        id: "member-1",
        initials: "MS",
        name: "Maya Singh",
        role: "Product designer",
        status: "online",
        color: "#F4B3A3",
        project: "Workspace refresh",
        lastActive: "Active now",
      },
      {
        id: "member-2",
        initials: "JL",
        name: "Jordan Lee",
        role: "Engineering lead",
        status: "focus",
        color: "#BED8EA",
        project: "Launch platform",
        lastActive: "In focus mode",
      },
    ],
    activities: [
      {
        id: "act-1",
        actor: "Alex",
        message: "initialized the workspace",
        timestamp: "Just now",
        tone: "mint",
      },
    ],
  };
}

module.exports = {
  createDefaultWorkspace,
};
