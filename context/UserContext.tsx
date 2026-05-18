import toast from "react-hot-toast";
import { create } from "zustand";

export interface AuthUser {
  id: string;
  role: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

export interface FollowUser {
  id: string;
  name?: string | null;
  image?: string | null;
  headline?: string | null;
}

interface UserContextStructure {
  user: AuthUser | null;

  loggedIn: boolean;

  followers: FollowUser[];

  following: FollowUser[];

  login: (data: AuthUser) => void;

  logout: () => void;

  setFollowers: (users: FollowUser[]) => void;

  setFollowing: (users: FollowUser[]) => void;

  // followUser: (user: FollowUser) => Promise<void>;

  // unfollowUser: (userId: string) => Promise<void>;

  toggleFollow: (user: FollowUser) => Promise<boolean>;
}

export const UserContext = create<UserContextStructure>((set, get) => ({
  user: null,

  loggedIn: false,

  followers: [],

  following: [],

  login: (data: AuthUser) => {
    set({
      user: data,
      loggedIn: true,
    });
  },

  logout: () =>
    set({
      user: null,
      loggedIn: false,
      followers: [],
      following: [],
    }),

  setFollowers: (users) =>
    set({
      followers: users,
    }),

  setFollowing: (users) =>
    set({
      following: users,
    }),

  // followUser: async (user) => {
  //   try {
  //     const res = await fetch(`/api/users/${user.id}/follow`, {
  //       method: "POST",
  //     });

  //     const json = await res.json();

  //     if (!json.success) return;

  //     set((state) => ({
  //       following: [...state.following, user],
  //     }));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  // unfollowUser: async (userId) => {
  //   try {
  //     const res = await fetch(`/api/user/${userId}/follow`, {
  //       method: "POST",
  //     });

  //     const json = await res.json();

  //     if (!json.success) return;

  //     set((state) => ({
  //       following: state.following.filter(
  //         (user) => user.id !== userId
  //       ),
  //     }));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  toggleFollow: async (user) => {
    try {
      const res = await fetch(`/api/user/${user.id}/follow`, {
        method: "POST",
      });

      const json = await res.json();

      if (!json.success) throw Error(json.message);

      const isFollowing = json.data.following;

      if (isFollowing) {
        set((state) => ({
          following: [...state.following, user],
        }));
      } else {
        set((state) => ({
          following: state.following.filter(
            (u) => u.id !== user.id
          ),
        }));
      }

      return isFollowing;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  },
}));