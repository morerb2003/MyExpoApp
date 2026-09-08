export type TaskTone = "coral" | "blue" | "yellow" | "mint";

export type DashboardTask = {
  id: number;
  title: string;
  meta: string;
  label: string;
  tone: TaskTone;
  done: boolean;
};

export const taskFilters = ["All", "Open", "Done"] as const;
export type TaskFilter = (typeof taskFilters)[number];
