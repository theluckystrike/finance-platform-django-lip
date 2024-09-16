// src/types/RouteTypes.ts
import React from 'react';
 
export type AppRoute = {
  path: string;
  element: React.ReactElement;
  children?: AppRoute[];
};
