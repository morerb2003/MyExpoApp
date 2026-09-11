import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { createInitialWorkspace } from "./data";
import {
  EventInput,
  NoteInput,
  TaskInput,
  TeamMemberInput,
  TeamMember,
  WorkspaceActivity,
  WorkspaceData,
  WorkspaceEvent,
  WorkspaceNote,
  WorkspaceSettings,
  WorkspaceTask,
} from "./types";

const STORAGE_KEY = "@myexpoapp/workspace-v1";

type WorkspaceContextValue = WorkspaceData & {
  state: WorkspaceData;
  isHydrated: boolean;
  createTask: (input: TaskInput) => void;
  updateTask: (id: string, patch: Partial<Omit<WorkspaceTask, "id" | "createdAt">>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  createNote: (input: NoteInput) => void;
  updateNote: (id: string, patch: Partial<Omit<WorkspaceNote, "id" | "createdAt">>) => void;
  deleteNote: (id: string) => void;
  toggleNotePinned: (id: string) => void;
  createEvent: (input: EventInput) => void;
  updateEvent: (id: string, patch: Partial<Omit<WorkspaceEvent, "id">>) => void;
  deleteEvent: (id: string) => void;
  updateSettings: (patch: Partial<WorkspaceSettings>) => void;
  addTeamMember: (input: TeamMemberInput) => void;
  updateTeamMember: (id: string, patch: Partial<Omit<TeamMember, "id">>) => void;
  deleteTeamMember: (id: string) => void;
  recordFocusMinutes: (minutes: number) => void;
  resetWorkspace: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function appendActivity(
  data: WorkspaceData,
  message: string,
  tone: WorkspaceActivity["tone"] = "neutral",
) {
  const activity: WorkspaceActivity = {
    id: createId("activity"),
    actor: data.settings.profileName.split(" ")[0] || "You",
    message,
    timestamp: "Just now",
    tone,
  };
  return [activity, ...data.activities].slice(0, 24);
}

function parseSavedWorkspace(raw: string | null): WorkspaceData | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("tasks" in parsed) ||
      !("notes" in parsed) ||
      !("events" in parsed) ||
      !("settings" in parsed)
    ) {
      return null;
    }
    const candidate = parsed as Partial<WorkspaceData>;
    if (
      !Array.isArray(candidate.tasks) ||
      !Array.isArray(candidate.notes) ||
      !Array.isArray(candidate.events) ||
      !Array.isArray(candidate.team) ||
      !Array.isArray(candidate.activities) ||
      !candidate.settings
    ) {
      return null;
    }
    return {
      ...candidate,
      version: 1,
      focusMinutes: typeof candidate.focusMinutes === "number" ? candidate.focusMinutes : 270,
      settings: {
        ...createInitialWorkspace().settings,
        ...candidate.settings,
      },
    } as WorkspaceData;
  } catch {
    return null;
  }
}

export function WorkspaceProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<WorkspaceData>(createInitialWorkspace);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        const saved = parseSavedWorkspace(raw);
        if (isMounted && saved) setState(saved);
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) setIsHydrated(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [isHydrated, state]);

  const createTask = useCallback((input: TaskInput) => {
    const now = new Date().toISOString();
    setState((current) => {
      const task: WorkspaceTask = { id: createId("task"), ...input, createdAt: now, updatedAt: now };
      return {
        ...current,
        tasks: [task, ...current.tasks],
        activities: appendActivity(current, `created “${task.title}”`, "coral"),
      };
    });
  }, []);

  const updateTask = useCallback(
    (id: string, patch: Partial<Omit<WorkspaceTask, "id" | "createdAt">>) => {
      setState((current) => ({
        ...current,
        tasks: current.tasks.map((task) =>
          task.id === id ? { ...task, ...patch, updatedAt: new Date().toISOString() } : task,
        ),
      }));
    },
    [],
  );

  const deleteTask = useCallback((id: string) => {
    setState((current) => {
      const removed = current.tasks.find((task) => task.id === id);
      return {
        ...current,
        tasks: current.tasks.filter((task) => task.id !== id),
        activities: removed
          ? appendActivity(current, `removed “${removed.title}”`, "neutral")
          : current.activities,
      };
    });
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setState((current) => {
      const task = current.tasks.find((item) => item.id === id);
      const nextStatus = task?.status === "done" ? "todo" : "done";
      return {
        ...current,
        tasks: current.tasks.map((item) =>
          item.id === id
            ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() }
            : item,
        ),
        activities:
          task && nextStatus === "done"
            ? appendActivity(current, `completed “${task.title}”`, "mint")
            : current.activities,
      };
    });
  }, []);

  const createNote = useCallback((input: NoteInput) => {
    const now = new Date().toISOString();
    setState((current) => {
      const note: WorkspaceNote = { id: createId("note"), ...input, createdAt: now, updatedAt: now };
      return {
        ...current,
        notes: [note, ...current.notes],
        activities: appendActivity(current, `captured “${note.title}”`, "yellow"),
      };
    });
  }, []);

  const updateNote = useCallback(
    (id: string, patch: Partial<Omit<WorkspaceNote, "id" | "createdAt">>) => {
      setState((current) => ({
        ...current,
        notes: current.notes.map((note) =>
          note.id === id ? { ...note, ...patch, updatedAt: new Date().toISOString() } : note,
        ),
      }));
    },
    [],
  );

  const deleteNote = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      notes: current.notes.filter((note) => note.id !== id),
    }));
  }, []);

  const toggleNotePinned = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      notes: current.notes.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() } : note,
      ),
    }));
  }, []);

  const createEvent = useCallback((input: EventInput) => {
    setState((current) => {
      const event: WorkspaceEvent = { id: createId("event"), ...input };
      return {
        ...current,
        events: [...current.events, event],
        activities: appendActivity(current, `scheduled “${event.title}”`, "blue"),
      };
    });
  }, []);

  const updateEvent = useCallback(
    (id: string, patch: Partial<Omit<WorkspaceEvent, "id">>) => {
      setState((current) => ({
        ...current,
        events: current.events.map((event) => (event.id === id ? { ...event, ...patch } : event)),
      }));
    },
    [],
  );

  const deleteEvent = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      events: current.events.filter((event) => event.id !== id),
    }));
  }, []);

  const updateSettings = useCallback((patch: Partial<WorkspaceSettings>) => {
    setState((current) => ({
      ...current,
      settings: { ...current.settings, ...patch },
    }));
  }, []);

  const addTeamMember = useCallback((input: TeamMemberInput) => {
    setState((current) => {
      const member: TeamMember = { id: createId("member"), ...input };
      return {
        ...current,
        team: [...current.team, member],
        activities: appendActivity(current, `invited ${member.name} to the workspace`, "mint"),
      };
    });
  }, []);

  const updateTeamMember = useCallback(
    (id: string, patch: Partial<Omit<TeamMember, "id">>) => {
      setState((current) => ({
        ...current,
        team: current.team.map((member) =>
          member.id === id ? { ...member, ...patch } : member,
        ),
      }));
    },
    [],
  );

  const deleteTeamMember = useCallback((id: string) => {
    setState((current) => {
      const removed = current.team.find((m) => m.id === id);
      return {
        ...current,
        team: current.team.filter((m) => m.id !== id),
        activities: removed
          ? appendActivity(current, `removed teammate ${removed.name}`, "neutral")
          : current.activities,
      };
    });
  }, []);

  const recordFocusMinutes = useCallback((minutes: number) => {
    setState((current) => ({
      ...current,
      focusMinutes: (current.focusMinutes || 0) + minutes,
      activities: appendActivity(
        current,
        `completed a ${minutes}m focus session`,
        "yellow",
      ),
    }));
  }, []);

  const resetWorkspace = useCallback(() => {
    const initial = createInitialWorkspace();
    setState(initial);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial)).catch(() => undefined);
  }, []);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      ...state,
      state,
      isHydrated,
      createTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      createNote,
      updateNote,
      deleteNote,
      toggleNotePinned,
      createEvent,
      updateEvent,
      deleteEvent,
      updateSettings,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      recordFocusMinutes,
      resetWorkspace,
    }),
    [
      addTeamMember,
      createEvent,
      createNote,
      createTask,
      deleteEvent,
      deleteNote,
      deleteTask,
      deleteTeamMember,
      isHydrated,
      recordFocusMinutes,
      resetWorkspace,
      state,
      toggleNotePinned,
      toggleTaskStatus,
      updateEvent,
      updateNote,
      updateSettings,
      updateTask,
      updateTeamMember,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return value;
}

export function useWorkspaceOptional() {
  return useContext(WorkspaceContext);
}
