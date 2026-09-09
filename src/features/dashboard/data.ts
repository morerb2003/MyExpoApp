import { DashboardTask } from "./types";

export const initialDashboardTasks: DashboardTask[] = [
  {
    id: "dashboard-1",
    title: "Finalize Q3 launch plan",
    meta: "Product / due 10:30 AM",
    label: "TODAY",
    tone: "coral",
    done: false,
  },
  {
    id: "dashboard-2",
    title: "Design review with Maya",
    meta: "Studio / 2:00 PM",
    label: "MEETING",
    tone: "blue",
    done: false,
  },
  {
    id: "dashboard-3",
    title: "Write weekly reflection",
    meta: "Personal / before Friday",
    label: "LATER",
    tone: "yellow",
    done: false,
  },
  {
    id: "dashboard-4",
    title: "Share research synthesis",
    meta: "Research / completed",
    label: "DONE",
    tone: "mint",
    done: true,
  },
];
