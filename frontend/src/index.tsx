import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import './assest/css/Custom.css';
import { SimpleRoute } from './Routes/AuthRoute';
import { AuthRoute } from './Routes/SimpleRoutes';
import { PublicRoutes } from './Routes/PublicRoute';
import { Provider } from 'react-redux';
import store from './Store';
import { ToastContainer } from 'react-toastify';
import { SidebarMenu } from './Menu';

// Create the router instance with all route configurations
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={`${SidebarMenu.upload.path}`} replace />,
  },
  ...PublicRoutes,
  ...SimpleRoute,
  ...AuthRoute,
]);

const rootElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function

// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
