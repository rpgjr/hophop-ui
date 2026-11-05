import axios from "axios";
import { API_BASE_URL } from "../config";
import type { ApplicationEntry, Status } from "./types";

const httpCall = axios.create({ baseURL: API_BASE_URL });

// keep the readable message the UI shows, e.g. "PATCH /api/applications/5/status failed: 500"
httpCall.interceptors.response.use(undefined, (error) => {
  if (axios.isAxiosError(error)) {
    const method = (error.config?.method ?? "get").toUpperCase();
    const status = error.response?.status ?? "network error";
    error.message = `${method} ${error.config?.url} failed: ${status}`;
  }
  return Promise.reject(error);
});

export const getStatuses = () =>
  httpCall.get<Status[]>("/api/statuses").then((r) => r.data);

// from/to are inclusive YYYY-MM-DD dates
export const getApplications = (from: string, to: string) => {
  const url = API_BASE_URL + "/api/applications";
  return httpCall
    .get<ApplicationEntry[]>(url, { params: { from, to } })
    .then((r) => r.data);
};

export const updateApplicationStatus = (id: number, statusId: number) => {
  const url = API_BASE_URL + `/api/applications/${id}/status`;
  return httpCall
    .patch<ApplicationEntry>(url, { statusId })
    .then((r) => r.data);
};

export const deleteApplication = (id: number) => {
  return httpCall.delete(`/api/applications/${id}`).then(() => undefined);
};
