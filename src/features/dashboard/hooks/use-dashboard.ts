import { useEffect, useMemo, useState } from "react";

import { initialDashboardTasks } from "../data";
import { DashboardTask, TaskFilter } from "../types";

export function useDashboard() {
  const [tasks, setTasks] = useState<DashboardTask[]>(initialDashboardTasks);
  const [filter, setFilter] = useState<TaskFilter>("All");
  const [seconds, setSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;
    const timer = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setTimerRunning(false);
          return 25 * 60;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerRunning]);

  const completedCount = tasks.filter((task) => task.done).length;
  const visibleTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          filter === "All" || (filter === "Done" ? task.done : !task.done),
      ),
    [filter, tasks],
  );
  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, done: !task.done, label: !task.done ? "DONE" : "TODAY" }
          : task,
      ),
    );
  }

  function addTask(title: string) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return false;
    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title: trimmedTitle,
        meta: "Personal / added just now",
        label: "NEW",
        tone: "coral",
        done: false,
      },
    ]);
    setFilter("All");
    return true;
  }

  return {
    tasks,
    filter,
    setFilter,
    completedCount,
    visibleTasks,
    formattedTime,
    timerRunning,
    setTimerRunning,
    toggleTask,
    addTask,
  };
}
