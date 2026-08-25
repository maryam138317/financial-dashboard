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
  verifyPassword: (password: string) => boolean;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => boolean;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
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

      verifyPassword: (password) => {
        const currentUser = get().currentUser;

        if (!currentUser) {
          return false;
        }

        const user = users.find(
          (user) =>
            user.username === currentUser.username &&
            user.password === password
        );

        return !!user;
      },

      changePassword: (currentPassword, newPassword) => {
        const currentUser = get().currentUser;

        if (!currentUser) {
          set({
            error: "You must be logged in to change your password.",
          });

          return false;
        }

        const user = users.find(
          (user) =>
            user.username === currentUser.username &&
            user.password === currentPassword
        );

        if (!user) {
          set({
            error: "Your current password is incorrect.",
          });

          return false;
        }

        // Demo/local-data implementation.
        // Update the in-memory user object.
        user.password = newPassword;

        set({
          error: null,
        });

        return true;
      },

      logout: () => {
        set({
          currentUser: null,
          loading: false,
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
