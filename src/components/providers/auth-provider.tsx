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
      if (user) return;

      // Try /api/auth/me — middleware will auto-refresh accessToken if needed
      let response = await fetch("/api/auth/me").catch(() => null);

      // If still 401, explicitly try refresh then retry once
      if (response?.status === 401) {
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
        }).catch(() => null);

        if (refreshRes?.ok) {
          response = await fetch("/api/auth/me").catch(() => null);
        }
      }

      if (response?.ok) {
        const userData = await response.json();
        dispatch(setCredentials({ user: userData, token: "" }));
      } else {
        dispatch(logout());
      }
    }

    restoreSession();
  }, [user, dispatch]);

  return <>{children}</>;
}
