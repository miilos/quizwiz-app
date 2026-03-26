import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_BASE_URI } from '../config';

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem('token');
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${BACKEND_BASE_URI}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return { res, json: await res.json() };
}

export async function apiSignup(username: string, email: string, password: string) {
  const res = await fetch(`${BACKEND_BASE_URI}/api/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return { res, json: await res.json() };
}

export async function apiGetMe() {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_BASE_URI}/api/me`, { headers });
  return { res, json: await res.json() };
}

export async function apiForgotPassword(email: string) {
  const res = await fetch(`${BACKEND_BASE_URI}/api/account/password/forgot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return { res, json: await res.json() };
}

export async function apiResetPassword(token: string, newPassword: string) {
  const res = await fetch(`${BACKEND_BASE_URI}/api/account/password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  return { res, json: await res.json() };
}

export async function apiEditProfile(username: string) {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_BASE_URI}/api/account/edit`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  return { res, json: await res.json() };
}

export async function apiGetAccountList() {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_BASE_URI}/api/account/list`, { headers });
  return { res, json: await res.json() };
}

export async function apiDeleteAccount(id: number) {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_BASE_URI}/api/account/${id}/delete`, {
    method: 'DELETE',
    headers,
  });
  return { res };
}

export async function apiAdminEditUser(id: number, username: string) {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_BASE_URI}/api/admin/account/${id}/edit`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  return { res, json: await res.json() };
}

export async function apiGenerateQuestion(prompt: string) {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_BASE_URI}/api/prompt/questions`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  return { res, json: await res.json() };
}

export async function apiGetAccessLog() {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_BASE_URI}/api/access-log`, { headers });
  return { res, json: await res.json() };
}

export async function apiGetQuizPdf(id: number): Promise<string> {
  const token = await getToken();
  return `${BACKEND_BASE_URI}/api/quiz/${id}/pdf?token=${token}`;
}

export { getToken, BACKEND_BASE_URI };
