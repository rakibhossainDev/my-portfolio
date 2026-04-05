const SESSION_KEY = "rh-admin-session";

export function isAdminSession(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function setAdminSession(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export const ADMIN_USER = "rakib";
export const ADMIN_PASS = "645066";
