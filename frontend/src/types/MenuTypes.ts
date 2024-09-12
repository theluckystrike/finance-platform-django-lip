export interface MenuItem {
  name: string;
  path: string; 
  icon: string,
  hide: boolean,
  role:string
}

// Define the interface for the AuthMenu object
export interface AuthMenutype {
  login: MenuItem;
  signup: MenuItem;
  // Add more items here if needed
}
export interface SidebarMenutype{
  home: MenuItem,
  upload: MenuItem,
  Allscripts: MenuItem,
  Report: MenuItem,
  tapesummary:MenuItem,
  errorhandling:MenuItem,
  scriptTree:MenuItem
}