/**
 * lib/api.ts — Central Axios API Client
 *
 * All backend calls go through this file.
 * JWT is automatically attached from localStorage/sessionStorage.
 * 401 responses automatically redirect to /login.
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { logger } from "./logger";
import type {
  LoginRequest,
  LoginResponse,
  DailyLog,
  DailyLogCreateDto,
  User,
  CandidateDetail,
  AdminStats,
  MailRequest,
  ContactInquiry,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ── Axios instance ────────────────────────────────────────────────────
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request interceptor: attach JWT ──────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    logger.debug(`API → ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    logger.error("API request error", { error: error.message });
    return Promise.reject(error);
  }
);

// ── Response interceptor: error handling & 401 redirect ──────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.debug(`API ← ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;

    logger.warn(`API error ${status}`, { url, message: error.message });

    if (status === 401) {
      // Clear stale tokens
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      // Redirect to login (Next.js router not available here — use window)
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?expired=true";
      }
    }

    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════════════════════════════════════
export const authAPI = {
  login: (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> =>
    apiClient.post("/api/auth/login", data),

  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AxiosResponse<LoginResponse>> =>
    apiClient.post("/api/auth/register", data),

  me: (): Promise<AxiosResponse<User>> =>
    apiClient.get("/api/auth/me"),

  refreshToken: (refreshToken: string): Promise<AxiosResponse<{ token: string }>> =>
    apiClient.post("/api/auth/refresh", { refreshToken }),

  forgotPassword: (email: string): Promise<AxiosResponse<string>> =>
    apiClient.post("/api/auth/forgot-password", { email }),

  resetPassword: (data: { token: string; newPassword: string }): Promise<AxiosResponse<string>> =>
    apiClient.post("/api/auth/reset-password", data),
};

// ═══════════════════════════════════════════════════════════════════════
// DAILY LOG API (Candidate)
// ═══════════════════════════════════════════════════════════════════════
export const dailyLogAPI = {
  /** Get current candidate's logs */
  getMyLogs: (): Promise<AxiosResponse<DailyLog[]>> =>
    apiClient.get("/api/daily-logs/my"),

  /** Get single log */
  getLog: (id: number): Promise<AxiosResponse<DailyLog>> =>
    apiClient.get(`/api/daily-logs/${id}`),

  /** Create a new daily log */
  createLog: (data: DailyLogCreateDto): Promise<AxiosResponse<DailyLog>> =>
    apiClient.post("/api/daily-logs", data),

  /** Update existing log */
  updateLog: (id: number, data: DailyLogCreateDto): Promise<AxiosResponse<DailyLog>> =>
    apiClient.put(`/api/daily-logs/${id}`, data),

  /** Delete a log */
  deleteLog: (id: number): Promise<AxiosResponse<void>> =>
    apiClient.delete(`/api/daily-logs/${id}`),

  /** Get all logs for PDF export */
  getLogsForExport: (): Promise<AxiosResponse<DailyLog[]>> =>
    apiClient.get("/api/daily-logs/export"),
};

// ═══════════════════════════════════════════════════════════════════════
// ADMIN API
// ═══════════════════════════════════════════════════════════════════════
export const adminAPI = {
  /** Get all candidates */
  getAllCandidates: (): Promise<AxiosResponse<User[]>> =>
    apiClient.get("/api/admin/candidates"),

  /** Get candidate details + logs */
  getCandidateDetail: (id: number): Promise<AxiosResponse<CandidateDetail>> =>
    apiClient.get(`/api/admin/candidates/${id}`),

  /** Update candidate status */
  updateStatus: (
    id: number,
    status: "ACTIVE" | "COMPLETED" | "ON_HOLD"
  ): Promise<AxiosResponse<User>> =>
    apiClient.put(`/api/admin/candidates/${id}/status`, { status }),

  /** Get candidate's daily logs */
  getCandidateLogs: (id: number): Promise<AxiosResponse<DailyLog[]>> =>
    apiClient.get(`/api/admin/candidates/${id}/logs`),

  /** Admin stats */
  getStats: (): Promise<AxiosResponse<AdminStats>> =>
    apiClient.get("/api/admin/stats"),
};

// ═══════════════════════════════════════════════════════════════════════
// MAIL API
// ═══════════════════════════════════════════════════════════════════════
export const mailAPI = {
  sendMail: (data: MailRequest): Promise<AxiosResponse<{ message: string }>> =>
    apiClient.post("/api/mail/send", data),

  sendBulk: (data: MailRequest): Promise<AxiosResponse<{ message: string }>> =>
    apiClient.post("/api/mail/send-bulk", data),
};

// ═══════════════════════════════════════════════════════════════════════
// CONTACT API
// ═══════════════════════════════════════════════════════════════════════
export const contactAPI = {
  submitInquiry: (data: ContactInquiry): Promise<AxiosResponse<{ message: string }>> =>
    apiClient.post("/api/contact", data),

  getAllInquiries: (): Promise<AxiosResponse<ContactInquiry[]>> =>
    apiClient.get("/api/contact/all"),

  updateStatus: (
    id: number,
    status: string
  ): Promise<AxiosResponse<ContactInquiry>> =>
    apiClient.put(`/api/contact/${id}/status?status=${status}`),

  healthCheck: (): Promise<AxiosResponse<string>> =>
    apiClient.get("/api/contact/health"),
};

export default apiClient;
