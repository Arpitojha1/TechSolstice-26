"use client";

import { useAuth } from "@/components/common/auth-context";

export function useUser() {
  const { user, loading } = useAuth();

  return {
    user: user ? {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      image: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
    } : null,
    loading,
    session: user ? { user } : null,
  };
}
