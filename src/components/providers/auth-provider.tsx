"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "@/store/slices/authSlice";
import { RootState } from "@/store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    async function restoreSession() {
      if (!user) {
        try {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const userData = await response.json();
            dispatch(setCredentials({ user: userData, token: "" }));
          } else {
            // If the token is invalid or expired, clear the state
            dispatch(logout());
          }
        } catch (error) {
          console.error("Failed to restore session:", error);
        }
      }
    }

    restoreSession();
  }, [user, dispatch]);

  return <>{children}</>;
}
