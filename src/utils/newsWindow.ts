import { NewsWindow } from "./newsWindows";

export function getNextNewsWindow(windows: NewsWindow[], now = new Date()): NewsWindow | null {
  const upcoming = windows.filter((window) => new Date(window.date).getTime() > now.getTime()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return upcoming[0] ?? null;
}