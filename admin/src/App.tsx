import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import { authLoader } from "./pages/loaders/authLoader";
import { ConfigProvider } from "antd";
import Matches from "./views/matches";
import Dashboard from "./pages/dashboard";
import { lightTheme } from "./utils/theme";
import UserForm from "./pages/users/form";
import UsersList from "./pages/users/list";
import MatchForm from "./pages/match/form";

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
      { path: "", element: <Matches /> },
      { path: "partidos", element: <Matches /> },
      { path: "nuevoPartido", element: <MatchForm /> },
      { path: "users", element: <UsersList /> },
      { path: "users/:id", element: <UserForm /> },
      { path: "newUser", element: <UserForm /> },
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
