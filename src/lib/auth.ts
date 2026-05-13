export interface UserAccount {
  username: string;
  passwordHash: string;
}

const USERS_KEY = "health-users";
const SESSION_KEY = "health-session";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function getUsers(): UserAccount[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users: UserAccount[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function signUp(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  const users = getUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: "Username already exists" };
  }
  if (password.length < 4) {
    return { success: false, error: "Password must be at least 4 characters" };
  }
  if (username.trim().length < 2) {
    return { success: false, error: "Username must be at least 2 characters" };
  }
  const passwordHash = await hashPassword(password);
  users.push({ username: username.trim(), passwordHash });
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, username.trim());
  return { success: true };
}

export async function signIn(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) return { success: false, error: "User not found" };
  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) return { success: false, error: "Incorrect password" };
  localStorage.setItem(SESSION_KEY, user.username);
  return { success: true };
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function getAllUsernames(): string[] {
  return getUsers().map(u => u.username);
}

export function getStorageKeyForUser(user: string, key: string): string {
  return `${key}__${user}`;
}
