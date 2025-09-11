import { create } from "zustand";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { fetchLeaderboardUsers, LeaderboardUser } from "@/api/leaderboard";
import { debounce } from "lodash";

interface LeaderboardState {
  data: LeaderboardUser[];
  pageDocs: (QueryDocumentSnapshot<DocumentData> | null)[];
  page: number;
  loading: boolean;
  hasMore: boolean;
  setPage: (page: number) => void;
  loadUsers: (pageIndex: number, searchValue?: string) => Promise<void>;
  search: string;
  handleSearch: (page: string) => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  data: [],
  pageDocs: [null],
  page: 0,
  loading: false,
  hasMore: true,
  search: "",
  setSearch: (val: string) => set({ search: val }),
  setPage: (page: number) => set({ page }),
  handleSearch: (val: string) => {
    set({ search: val });
  },
  loadUsers: async (pageIndex = get().page) => {
    if (get().loading) return;

    set({ loading: true });
    const pageDocs = get().pageDocs;
    const startAfterDoc = pageDocs[pageIndex] || null;

    const result = await fetchLeaderboardUsers();

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
