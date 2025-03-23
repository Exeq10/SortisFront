import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Spinner from "./components/Spinner";
import InstallPrompt from "./components/InstallPrompt";
import ProtectedRoutes from "./components/ProtectedRoute";
import ViewProfileTarotista from "./pages/User/ViewProfileTarotista";
import Dashboard from "./pages/Tarotista/Dashboard.jsx";
import UserProfile from "./pages/Tarotista/UserProfile.jsx";
import ChatList from "./pages/Tarotista/ChatList.jsx";
import Statics from "./pages/Tarotista/Statics.jsx";


/* Sección usuarios */
const Landing = lazy(() => import("./pages/User/Landing"));
const Register = lazy(() => import("./pages/User/Register"));
const Login = lazy(() => import("./pages/User/Login"));
const DashboardUser = lazy(() => import("./pages/User/DasboardUser"));
const Onboarding = lazy(() => import("./pages/User/Onboarding"));
const SelectTarotista = lazy(() => import("./pages/User/SelectTarotista"));
const PlanSelect = lazy(() => import("./pages/User/PlanSelect"));
const Plan = lazy(() => import("./pages/User/Plan"));
const DashboardAll = lazy(() => import("./components/DashboardAll"));


/* Sección tarotistas */
const LoginTarot = lazy(() => import("./pages/Tarotista/LoginTarot"));
const DashboardAllTarot = lazy(() => import("./pages/Tarotista/DashboardAllTarot.jsx"));
const Profile = lazy (() =>import  ("./pages/User/Profile.jsx") )
const Entrada = lazy(()=> import ("./pages/Tarotista/Entrada.jsx"))


const router = createBrowserRouter([
  /* Rutas públicas */
  { path: "/", element: <Landing /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/loginTarot", element: <LoginTarot /> },

  /* Rutas protegidas */
  {
    element: <ProtectedRoutes />,
    children: [
      { path: "/menu", element: <DashboardUser /> },
      { path: "/onboarding", element: <Onboarding /> },
      { path: "/selectTarot", element: <SelectTarotista /> },
      { path: "/selectPlan", element: <PlanSelect /> },
      { path: "/PlanPaid/:plan", element: <Plan /> },
   
      { path:'/tarotistaProfile/:nombre', element: <ViewProfileTarotista /> }, 

      /* Dashboard con rutas hijas */
      {
        path: "/dashboardUser",
        element: <DashboardUser />,
        children: [
          { index: true, element: <DashboardAll /> }, // DashboardAll como vista inicial
          {path:'profile', element: <Profile/>},
        ],
      },
      /* Dashboard con rutas hijas */
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          { index: true, element: <DashboardAllTarot/>}, // DashboardAll como vista inicial
          {path:'profileTarot', element: <UserProfile/>},
          {path:'chats', element: <ChatList/>},
          {path:'create', element: <Entrada/>},
          {path:'statics', element: <Statics/>},
        ],
      },
      
      /* {path:'/entries', element: <Entrada/>} */
      
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
