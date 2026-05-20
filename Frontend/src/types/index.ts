// TypeScript type definitions for the entire application

export type UserRole = "ADMIN" | "CANDIDATE";
export type InternshipStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "ON_HOLD";
export type LogMood = "GREAT" | "GOOD" | "NEUTRAL" | "DIFFICULT";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  joiningDate?: string;       // ISO date string
  internshipTrack?: string;
  status?: InternshipStatus;
  createdAt?: string;
  collegeName?: string;
  bio?: string;
  profilePic?: string;
  twoFactorEnabled?: boolean;
  internshipDurationMonths?: number;
  disabled?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
  message: string;
}

export interface DailyLog {
  id: number;
  candidateId: number;
  logDate: string;            // ISO date string YYYY-MM-DD
  tasksDone: string;
  hoursWorked: number;
  challenges?: string;
  planTomorrow?: string;
  mood?: LogMood;
  createdAt: string;
  updatedAt?: string;
  tools?: string[];
  status?: string;
  revisionNote?: string;
}

export interface DailyLogCreateDto {
  logDate: string;
  tasksDone: string;
  hoursWorked: number;
  challenges?: string;
  planTomorrow?: string;
  mood?: LogMood;
  tools?: string[];
}

export interface CandidateDetail extends User {
  dailyLogs: DailyLog[];
  totalHoursWorked: number;
  totalLogsSubmitted: number;
  lastLogDate?: string;
  completionPercentage?: number;
}

export interface AdminStats {
  totalCandidates: number;
  activeCandidates: number;
  completedCandidates: number;
  onHoldCandidates: number;
  logsSubmittedToday: number;
  logsSubmittedThisWeek: number;
  averageHoursPerDay: number;
}

export interface MailRequest {
  to: string[];              // list of emails
  subject: string;
  body: string;
  isHtml?: boolean;
  templateId?: string;
}

export interface ContactInquiry {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  message: string;
  status?: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
