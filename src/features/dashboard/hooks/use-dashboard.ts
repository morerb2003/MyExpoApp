import { useMemo, useState } from "react";

import { useWorkspace } from "@/features/workspace";
import { DashboardTask, TaskFilter } from "../types";

export function useDashboard() {
  const {
    tasks: workspaceTasks,
    createTask,
    toggleTaskStatus,
    focusMinutes,
    settings,
    activities,
    timerRunning,
    formattedTimerTime,
    toggleTimer,
    resetTimer,
  } = useWorkspace();
  const [filter, setFilter] = useState<TaskFilter>("All");

  const tasks = useMemo<DashboardTask[]>(
    () =>
      workspaceTasks.map((task) => ({
        id: task.id,
        title: task.title,
        meta: `${task.project} / ${task.priority} priority`,
        label:
          task.status === "done"
            ? "DONE"
            : task.dueDate === new Date().toISOString().slice(0, 10)
              ? "TODAY"
              : task.dueDate,
        tone:
          task.priority === "high"
            ? "coral"
            : task.priority === "medium"
              ? "yellow"
              : "mint",
        done: task.status === "done",
      })),
    [workspaceTasks],
  );
  const completedCount = tasks.filter((task) => task.done).length;
  const visibleTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          filter === "All" || (filter === "Done" ? task.done : !task.done),
      ),
    [filter, tasks],
  );
  const focusHours = ((focusMinutes ?? 270) / 60).toFixed(1);

  function toggleTask(id: string) {
    toggleTaskStatus(id);
  }

  function addTask(title: string) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return false;
    createTask({
      title: trimmedTitle,
      description: "",
      priority: "medium",
      dueDate: new Date().toISOString().slice(0, 10),
      status: "todo",
      project: "Personal",
    });
    setFilter("All");
    return true;
  }

  return {
    tasks,
    filter,
    setFilter,
    completedCount,
    visibleTasks,
    formattedTime: formattedTimerTime,
    timerRunning,
    toggleTimer,
    resetTimer,
    toggleTask,
    addTask,
    focusHours,
    settings,
    activities,
  };
}
