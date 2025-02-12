import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import { authLoader } from "./pages/loaders/authLoader";
import { ConfigProvider } from "antd";
import DashboardHome from "./views/dashboardHome";
import Matches from "./views/matches";
import TestUserProfile from "./views/testProfile";
import Dashboard from "./pages/dashboard";
import { useState } from "react";
import { lightTheme } from "./utils/theme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <Dashboard />,
    loader: authLoader,
    children: [
      { path: "", element: <DashboardHome /> },
      { path: "partidos", element: <Matches /> },
      { path: "profile", element: <TestUserProfile /> },
    ],
  },
]);

const App = () => (
  <Provider store={store}>
    <ConfigProvider theme={lightTheme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </Provider>
);

export default App;
