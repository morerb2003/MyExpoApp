export type TaskPriority = "high" | "medium" | "low";

export type TaskStatus = "todo" | "in-progress" | "done";

export type WorkspaceTask = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  project: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceNote = {
  id: string;
  title: string;
  body: string;
  category: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
};

export type WorkspaceEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  description: string;
  attendees: string[];
  color: string;
};

export type TeamStatus = "online" | "focus" | "away";

export type TeamMember = {
  id: string;
  initials: string;
  name: string;
  role: string;
  status: TeamStatus;
  color: string;
  project: string;
  lastActive: string;
};

export type AppearancePreference = "system" | "light" | "dark";

export type WorkspaceSettings = {
  profileName: string;
  email: string;
  appearance: AppearancePreference;
  notifications: boolean;
  language: string;
  dailyDigest: boolean;
};

export type WorkspaceActivity = {
  id: string;
  actor: string;
  message: string;
  timestamp: string;
  tone: "coral" | "mint" | "yellow" | "blue" | "neutral";
};

export type WorkspaceData = {
  version: 1;
  tasks: WorkspaceTask[];
  notes: WorkspaceNote[];
  events: WorkspaceEvent[];
  team: TeamMember[];
  settings: WorkspaceSettings;
  activities: WorkspaceActivity[];
};

export type TaskInput = Omit<WorkspaceTask, "id" | "createdAt" | "updatedAt">;
export type NoteInput = Omit<WorkspaceNote, "id" | "createdAt" | "updatedAt">;
export type EventInput = Omit<WorkspaceEvent, "id">;
export type TeamMemberInput = Omit<TeamMember, "id">;
