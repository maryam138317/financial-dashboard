import { create } from "zustand";
import { users } from "@/lib/data";
import { User } from "@/lib/types";

type AuthUser = Omit<User, "password">;

interface AuthStore {
  currentUser: AuthUser | null;
  loading: boolean;
  error : string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  getUser: () => AuthUser | null;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: null,
  loading: true,
  error: null,

  login: (username, password) => {
    const user = users.find(
      (user) =>
        user.username === username &&
        user.password === password
    );

    if (!user) {
        set({loading: false})
        set({error: 'No user found with this condidates!'})
        return false;
    }

    const { password: _, ...authUser } = user;

    set({
        currentUser: authUser,
        loading: false,
        error: null
    });

    return true;
  },

  logout: () => {
    set({
      currentUser: null,
      loading: false,
      error: null
    });
  },

  getUser: () => {
    set({
        loading: false,
        error: null
    })
    return get().currentUser;
  },
}));
