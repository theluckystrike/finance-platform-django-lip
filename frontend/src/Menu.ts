import { AuthMenutype } from "./types/MenuTypes";

export const AuthMenu: AuthMenutype = {
  login: {
    name: "Login",
    path: "",
  },
  signup: {
    name: "Signup",
    path: "signup",
  },
};

export const SidebarMenu = {
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
  },
  Allscripts: {
    name: "All scripts",
    path: "allscripts",
    icon: "List",
  },
  Report: {
    name: "Reports",
    path: "Report",
    icon: "Report",
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
};
