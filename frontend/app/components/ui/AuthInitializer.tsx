// /components/AuthInitializer.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { setAuthTokenGetter } from "@/lib/apiClient";

const AuthInitializer = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  return null; // no UI
};

export default AuthInitializer;