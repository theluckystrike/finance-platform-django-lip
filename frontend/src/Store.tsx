// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import api from './Redux/AuthSlice';
import projectApi from './Redux/Project';
import Categoryapi from './Redux/CategoryQuery'
import dashboardApi from './Redux/Dashboard';
import ScriptApi from './Redux/Script';
import ScriptSlice from './Redux/Script/ScriptSlice';
import ReportSlice from './Redux/Report/Slice';
import SummerySlice from './Redux/TapeSummary/Slice'

export const store = configureStore({
  reducer: {
    
    [api.reducerPath]: api.reducer,
    [projectApi.reducerPath]:projectApi.reducer,
    [dashboardApi.reducerPath]:dashboardApi.reducer,
    [ScriptApi.reducerPath]:ScriptApi.reducer,
    [Categoryapi.reducerPath]:Categoryapi.reducer,
    script:ScriptSlice,
    report:ReportSlice,
    summary:SummerySlice



  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware,Categoryapi.middleware, projectApi.middleware,dashboardApi.middleware,ScriptApi.middleware),
});

setupListeners(store.dispatch);

export default store;