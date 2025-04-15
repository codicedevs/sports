import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import LoginPage from "./pages/login";
import { authLoader } from "./pages/auth.loader";
import { ConfigProvider } from "antd";
import Dashboard from "./components/layout/main";
import { lightTheme } from "./theme/antdTheme";
import UserForm from "./pages/users/form";
import UsersList from "./pages/users/list";
import MatchForm from "./pages/matches/form";
import MatchesList from "./pages/matches/list";
import SportList from "./pages/sports/list";
import SportForm from "./pages/sports/form";

import LocationForm from "./pages/location/form";
import ZoneList from "./pages/zone/list";
import LocationList from "./pages/location/list";
import ZoneForm from "./pages/zone/form";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Dashboard />,
    loader: authLoader,
    children: [
      { path: "", element: <MatchesList /> },
      { path: "partidos", element: <MatchesList /> },
      { path: "partidos/nuevo", element: <MatchForm /> },
      { path: "usuarios", element: <UsersList /> },
      { path: "usuarios/:id", element: <UserForm /> },
      { path: "usuarios/nuevo", element: <UserForm /> },
      { path: "deportes", element: <SportList /> },
      { path: "deportes/:id", element: <SportForm /> },
      { path: "deportes/nuevo", element: <SportForm /> },
      { path: "establecimiento", element: <LocationList /> },
      { path: "establecimiento/:id", element: <LocationForm /> },
      { path: "establecimiento/nuevo", element: <LocationForm /> },
      { path: "zona", element: <ZoneList /> },
      { path: "zona/:id", element: <ZoneForm /> },
      { path: "zona/nuevo", element: <ZoneForm /> },
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
