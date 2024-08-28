import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./assest/css/Custom.css";
import { SimpleRoute } from "./Routes/AuthRoute";
import { AuthRoute } from "./Routes/SimpleRoutes";
import { Provider } from "react-redux";
import store from "./Store";
import { ToastContainer } from "react-toastify";

// Create the router instance with all route configurations
const router = createBrowserRouter([
  ...SimpleRoute,
  ...AuthRoute
]);

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
     
    <ToastContainer />
      
    <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
