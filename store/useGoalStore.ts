import { Goal } from "@/lib/types"
import { goals as seedGoals } from "@/lib/data"
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

// useGoalStore.ts — change addGoal's return type and implementation
interface GoalStore {
    goals: Goal[];
    addGoal: (goal: Omit<Goal, "id" | "user_id">) => string; // now returns the new id
    removeGoal: (id: string) => void;
}

export const useGoalStore = create<GoalStore>((set) => ({
    goals: seedGoals,

    addGoal: (goal) => {
        const { currentUser } = useAuthStore.getState();
        const id = crypto.randomUUID();

        if (!currentUser) return id; // caller still gets an id even if this shouldn't happen

        const newGoal: Goal = {
            ...goal,
            id,
            user_id: currentUser.id,
        };

        set((state) => ({
            goals: [...state.goals, newGoal],
        }));

        return id;
    },

    removeGoal: (id) => {
        set((state) => ({
            goals: state.goals.filter((goal) => goal.id !== id),
        }));
    },
}))