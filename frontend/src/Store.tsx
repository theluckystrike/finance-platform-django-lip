// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import api from './Redux/AuthSlice';
import projectApi from './Redux/Project';

import dashboardApi from './Redux/Dashboard';
import ScriptApi from './Redux/Script';

export const store = configureStore({
  reducer: {
    // Add the API reducer to the store
    [api.reducerPath]: api.reducer,
    [projectApi.reducerPath]:projectApi.reducer,
    [dashboardApi.reducerPath]:dashboardApi.reducer,
    [ScriptApi.reducerPath]:ScriptApi.reducer,


  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware,projectApi.middleware,dashboardApi.middleware,ScriptApi.middleware),
});

setupListeners(store.dispatch);

export default store;
