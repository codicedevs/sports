import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import { authLoader } from "./pages/loaders/authLoader";
import Dashboard from "./pages/dashboard";
import { ConfigProvider } from "antd";
import DashboardHome from "./views/dashboardHome";
import Settings from "./views/settings";
import Users from "./views/users";

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
    path: "/protected",
    element: <Dashboard />,
    loader: authLoader,
    children: [
      { path: "", element: <DashboardHome /> },
      { path: "settings", element: <Settings /> },
      { path: "profile", element: <Users /> },
    ],
  },
]);

const App = () => (
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#56116b",
          borderRadius: 2,

          // Alias Token
          colorBgContainer: "#f6ffed",
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </Provider>
);

export default App;
