import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Spinner from "./components/Spinner";
import InstallPrompt from "./components/InstallPrompt";
import ProtectedRoutes from "./components/ProtectedRoute";

/* Sección usuarios */
const Landing = lazy(() => import("./pages/User/Landing"));
const Register = lazy(() => import("./pages/User/Register"));
const Login = lazy(() => import("./pages/User/Login"));
const DashboardUser = lazy(() => import("./pages/User/DasboardUser"));
const Onboarding = lazy(() => import("./pages/User/Oboarding"));
const SelectTarotista = lazy(() => import("./pages/User/SelectTarotista"));
const PlanSelect = lazy(() => import("./pages/User/PlanSelect"));
const Plan = lazy(() => import("./pages/User/Plan"));

/* Sección tarotistas */
const LoginTarot = lazy(() => import("./pages/Tarotista/LoginTarot"));

const router = createBrowserRouter([
  /* Rutas públicas */
  { path: "/", element: <Landing /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },

  /* Rutas protegidas (dentro de ProtectedRoutes) */
  {
    element: <ProtectedRoutes />,
    children: [
      { path: "/menu", element: <DashboardUser /> },
      { path: "/onboarding", element: <Onboarding /> },
      { path: "/selectTarot", element: <SelectTarotista /> },
      { path: "/selectPlan", element: <PlanSelect /> },
      { path: "/PlanPaid/:plan", element: <Plan /> },
      { path: "/loginTarot", element: <LoginTarot /> },
      { path: "/dashboardUser", element: <DashboardUser /> },
    ],
  },
]);

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <RouterProvider router={router} />
      <InstallPrompt />
    </Suspense>
  );
}

export default App;
