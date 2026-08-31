import { Goal } from "@/lib/types"
import { goals as seedGoals } from "@/lib/data"
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

interface GoalStore {
    goals: Goal[];

    addGoal: (
        goal: Omit<Goal, "id" | "user_id">
    ) => void;

    removeGoal: (id: string) => void;
}

export const useGoalStore = create<GoalStore>((set) => ({
    goals: seedGoals,

    addGoal: (goal) => {
        const { currentUser } = useAuthStore.getState();

        if (!currentUser) return;

        const newGoal: Goal = {
            ...goal,
            id: crypto.randomUUID(),
            user_id: currentUser.id,
        };

        set((state) => ({
            goals: [
                ...state.goals,
                newGoal,
            ],
        }));
    },

    removeGoal: (id) => {
        set((state) => ({
            goals: state.goals.filter((goal) => goal.id !== id),
        }));
    },
}))