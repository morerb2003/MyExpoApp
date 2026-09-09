export function toDateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function isSameDate(left: string, right: string) {
  return left === right;
}

export function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  const date = fromDateKey(value);
  return new Intl.DateTimeFormat("en-US", options ?? {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function relativeDateLabel(value: string, today = toDateKey(new Date())) {
  if (value === today) return "Today";
  if (value === toDateKey(addDays(fromDateKey(today), 1))) return "Tomorrow";
  if (value === toDateKey(addDays(fromDateKey(today), -1))) return "Yesterday";
  return formatDate(value);
}
