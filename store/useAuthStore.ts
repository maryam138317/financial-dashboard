import { create } from "zustand";
import { persist } from "zustand/middleware";
import { users } from "@/lib/data";
import { User } from "@/lib/types";

type AuthUser = Omit<User, "password">;

interface AuthStore {
  currentUser: AuthUser | null;
  loading: boolean;
  error: string | null;

  login: (username: string, password: string) => boolean;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      currentUser: null,
      loading: false,
      error: null,

      login: (username, password) => {
        set({
          loading: true,
          error: null,
        });

        const user = users.find(
          (user) =>
            user.username === username &&
            user.password === password
        );

        if (!user) {
          set({
            loading: false,
            error: "Invalid username or password",
          });

          return false;
        }

        const { password: _, ...authUser } = user;

        set({
          currentUser: authUser,
          loading: false,
          error: null,
        });

        return true;
      },

      logout: () => {
        set({
          currentUser: null,
          error: null,
        });
      },

      clearError: () => {
        set({
          error: null,
        });
      },
    }),
    {
      name: "finance-auth",
    }
  )
);
