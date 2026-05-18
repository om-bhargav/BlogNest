import {
  FileHeart,
  Files,
  Folder,
  Home,
  Newspaper,
  Rss,
  Settings,
  Users,
  FileTextIcon,
  Users2,
} from "lucide-react";
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;

export const panelLinks = [
  {
    name: "Dashboard",
    path: "/u",
    icon: Home,
    roles: ["ADMIN", "USER"],
  },
  {
    name: "My Feed",
    path: "/u/feed",
    icon: Rss,
    roles: ["USER"],
  },
  {
    name: "Liked Blogs",
    path: "/u/liked-blogs",
    icon: FileHeart,
    roles: ["USER"],
  },
  {
    name: "Saved Blogs",
    path: "/u/saved-blogs",
    icon: Folder,
    roles: ["USER"],
  },
  {
    name: "Followed Creators",
    path: "/u/following",
    icon: Users,
    roles: ["USER"],
  },
  {
    name: "Followers",
    path: "/u/followers",
    icon: Users2,
    roles: ["USER"],
  },
  {
    name: "My Blogs",
    path: "/u/blogs",
    icon: Newspaper,
    roles: ["USER"],
  },

  // ADMIN
  {
    name: "Manage Users",
    path: "/u/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    name: "Manage Blogs",
    path: "/u/manage-blogs",
    icon: FileTextIcon,
    roles: ["ADMIN"],
  },
  {
    name: "Manage Categories",
    path: "/u/manage-categories",
    icon: Folder,
    roles: ["ADMIN"],
  },

  // COMMON
  {
    name: "Settings",
    path: "/u/settings",
    icon: Settings,
    roles: ["ADMIN", "USER"],
  },
];