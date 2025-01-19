import path from 'path';
import { AuthMenutype, SidebarMenutype } from './types/MenuTypes';

export const AuthMenu: AuthMenutype = {
  login: {
    name: 'Login',
    path: 'login',
    icon: 'Login',
    hide: false,
    role: 'all',
  },
  signup: {
    name: 'Signup',
    path: 'signup',
    icon: 'Signup',
    hide: false,
    role: 'all',
  },
};

export const SidebarMenu: SidebarMenutype = {
  home: {
    name: 'Home',
    path: 'home',
    icon: 'Home',
    hide: true,
    role: 'all',
  },
  upload: {
    name: 'Upload',
    path: 'upload',
    icon: 'Upload',
    hide: false,
    role: 'all',
  },
  Allscripts: {
    name: 'All scripts',
    path: 'allscripts',
    icon: 'List',
    hide: false,
    role: 'all',
  },
  Filterscripts: {
    name: 'Filter scripts',
    path: 'filter-scripts',
    icon: 'List',
    hide: true,
    role: 'all',
  },
  Report: {
    name: 'Reports',
    path: 'Report',
    icon: 'Report',
    hide: false,
    role: 'all',
  },
  tapesummary: {
    name: 'Model Summary',
    path: 'model-summary',
    icon: 'Summarize',
    hide: false,
    role: 'all',
  },
  scriptTree: {
    name: 'Script Tree',
    path: 'scriptTree',
    icon: 'AccountTree',
    hide: false,
    role: 'all',
  },
  errorhandling: {
    name: 'Error Handling',
    path: 'error-handling',
    icon: 'Error',
    hide: false,
    role: 'all',
  },
};

export const ActiveRoute = {
  ReportDetails: {
    name: 'ReportDetails',
    path: 'ReportDetails/:id',
    icon: 'Report',
  },
  ScriptDetails: {
    name: 'ScriptDetails',
    path: 'ScriptDetails/:id',
    icon: 'Script',
  },
  ScriptEdit: {
    name: 'ScriptEdit',
    path: 'ScriptEdits',
    icon: 'Script',
  },
  CategoryManager: {
    name: 'Category Manager',
    path: 'category-manager',
    icon: 'CategoryManager',
  },
  CreateSummary: {
    name: 'Create Model Summary',
    path: 'create-summary',
  },
  TapeSummaryResult: {
    name: 'Model Summary Result',
    path: 'model-summary-results/:id',
    icon: 'CategoryManager',
  },
  UserProfile: {
    name: 'Profile',
    path: 'user-profile',
    icon: 'Profile',
  },
};
