import path from "path";
import { AuthMenutype, SidebarMenutype } from "./types/MenuTypes";

export const AuthMenu: AuthMenutype = {
  login: {
    name: "Login",
    path: "",
    icon: "Login",
    hide: false,
  },
  signup: {
    name: "Signup",
    path: "signup",
    icon: "Signup",
    hide: false,
  },
};

export const SidebarMenu: SidebarMenutype = {
  home: {
    name: "Home",
    path: "home",
    icon: "Home",
    hide: true,
  },
  upload: {
    name: "Upload",
    path: "upload",
    icon: "Upload",
    hide: false,
  },
  Allscripts: {
    name: "All scripts",
    path: "allscripts",
    icon: "List",
    hide: false,
  },
  Report: {
    name: "Reports",
    path: "Report",
    icon: "Report",
    hide: false,
  },
  tapesummary: {
    name: "Tape Summary",
    path: "tape-summary",
    icon: "Summarize",
    hide: false,
  },
};

export const ActiveRoute = {
  ReportDetails: {
    name: "ReportDetails",
    path: "ReportDetails",
    icon: "Report",
  },
  ScriptDetails: {
    name: "ScriptDetails",
    path: "ScriptDetails",
    icon: "Script",
  },
  ScriptEdit: {
    name: "ScriptEdit",
    path: "ScriptEdits",
    icon: "Script",
  },
  CategoryManager: {
    name: "Category Manager",
    path: "category-manager",
    icon: "CategoryManager",
  },
  TapeSummaryResult: {
    name: "Tape Summary Result",
    path: "tape-summary-results",
    icon: "CategoryManager",
  },
};
