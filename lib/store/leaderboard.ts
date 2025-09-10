import { create } from "zustand";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { fetchLeaderboardUsers, LeaderboardUser } from "@/api/leaderboard";

interface LeaderboardState {
  data: LeaderboardUser[];
  pageDocs: (QueryDocumentSnapshot<DocumentData> | null)[];
  page: number;
  loading: boolean;
  hasMore: boolean;
  setPage: (page: number) => void;
  loadUsers: (pageIndex?: number) => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  data: [],
  pageDocs: [null],
  page: 0,
  loading: false,
  hasMore: true,

  setPage: (page: number) => set({ page }),

  loadUsers: async (pageIndex = get().page) => {
    if (get().loading) return;

    set({ loading: true });
    const pageDocs = get().pageDocs;
    const startAfterDoc = pageDocs[pageIndex] || null;

    const result = await fetchLeaderboardUsers(startAfterDoc, 15);

    set((state) => ({
      data: result.users,
      pageDocs: result.lastDoc
        ? [...state.pageDocs.slice(0, pageIndex + 1), result.lastDoc]
        : state.pageDocs,
      hasMore: result.users.length === 15,
      loading: false,
    }));
  },
}));
