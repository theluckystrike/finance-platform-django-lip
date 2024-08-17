export interface MenuItem {
  name: string;
  path: string;
}

// Define the interface for the AuthMenu object
export interface AuthMenutype {
  login: MenuItem;
  signup: MenuItem;
  // Add more items here if needed
}