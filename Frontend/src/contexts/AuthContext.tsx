"use client";

/**
 * AuthContext — JWT-based authentication with role support
 *
 * Stores the JWT token in localStorage (remember me) or sessionStorage.
 * Decodes the JWT payload to extract user info and role without a server call.
 * Provides: user, token, isAuthenticated, isLoading, login(), logout()
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";
import type { User, AuthState, LoginResponse } from "@/types";

interface AuthContextValue extends AuthState {
  login: (response: LoginResponse, rememberMe?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── JWT decoder (no library needed for read-only decode) ─────────────
function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return Date.now() >= payload.exp * 1000;
}

function getUserFromToken(token: string, storedUser?: User | null): User | null {
  const payload = decodeJwt(token);
  if (!payload) return null;

  return {
    id:               (payload.id as number) || (storedUser?.id ?? 0),
    name:             (payload.name as string) || (storedUser?.name ?? ""),
    email:            (payload.sub as string) || (storedUser?.email ?? ""),
    role:             (payload.role as User["role"]) || (storedUser?.role ?? "CANDIDATE"),
    joiningDate:      (payload.joiningDate as string) || storedUser?.joiningDate,
    internshipTrack:  (payload.internshipTrack as string) || storedUser?.internshipTrack,
    status:           (payload.status as User["status"]) || storedUser?.status,
  };
}

// ── Provider ─────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();

  // On mount: restore session from storage
  useEffect(() => {
    const checkAuth = () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("authUser");
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const storedUserRaw = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
      const storedUser: User | null = storedUserRaw ? JSON.parse(storedUserRaw) : null;
      const user = getUserFromToken(token, storedUser);

      if (user) {
        setState({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    };

    checkAuth();

    // Handle Back/Forward cache (BFCache)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        checkAuth();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const login = useCallback(
    (response: LoginResponse, rememberMe: boolean = false) => {
      const { token, user } = response;
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("authToken", token);
      storage.setItem("authUser", JSON.stringify(user));

      setState({ user, token, isAuthenticated: true, isLoading: false });
      logger.info("User logged in", { email: user.email, role: user.role });
    },
    []
  );

  const logout = useCallback(() => {
    const email = state.user?.email;
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authUser");
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    logger.info("User logged out", { email });
    
    // Force a hard redirect to clear memory and prevent back-button stale state
    window.location.href = "/login";
  }, [state.user?.email]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ─────────────────────────────────────────────────────────────
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
};
