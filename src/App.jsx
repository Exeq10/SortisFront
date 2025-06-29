import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Spinner from "./components/Spinner";
import InstallPrompt from "./components/InstallPrompt.jsx";
import ProtectedRoutes from "./components/ProtectedRoute";
import ProtectedTarotRoutes from "./components/ProtectedTarotRoutes.jsx";
import ViewProfileTarotista from "./pages/User/ViewProfileTarotista";
import Dashboard from "./pages/Tarotista/Dashboard.jsx";
import UserProfile from "./pages/Tarotista/UserProfile.jsx";

import Statics from "./pages/Tarotista/Statics.jsx";
import ErrorPage from "./pages/ErrorPage"; // Importamos la ErrorPage
import PagoExitoso from "./pages/User/PagoExitoso.jsx";
import RecoverPassword from "./pages/User/RecoverPassword.jsx";
import VerifyCode from "./pages/User/VerifyCode.jsx";
import NewPassword from "./pages/User/NewPassword.jsx";
import TermsAndConditions from "./pages/User/TermsAndConditions.jsx";
import ChatComponent from "./pages/User/ChatComponent.jsx";
import PostDetail from "./components/PostDetail.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import BlogPosts from "./pages/User/BlogPost.jsx";
import ChatTarotista from "./pages/Tarotista/ChatTarotista.jsx";
import HistorialConversacionesTarotista from "./pages/Tarotista/HistorialConversacionesTarotista.jsx";
import CouponManager from "./pages/Tarotista/CouponManager.jsx";

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
const Profile = lazy(() => import("./pages/User/Profile.jsx"));
const Entrada = lazy(() => import("./pages/Tarotista/Entrada.jsx"));
const ChatComponentTarotista = lazy(() => import("./pages/Tarotista/ChatTarotista.jsx"));





const router = createBrowserRouter([
  /* Rutas públicas */
  { path: "/", element: <Landing /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/loginTarot", element: <LoginTarot /> },
  { path: "/recoveryPass", element: <RecoverPassword /> },
  { path: "/verify-code", element: <VerifyCode /> },
  { path: "/new-password", element: <NewPassword /> },
  { path: "/terms&conditions", element: <TermsAndConditions /> },
  { path: "/sala/tarotista", element: <ChatComponentTarotista /> }
,

  /* Rutas protegidas para USUARIOS */
  {
    element: <ProtectedRoutes />,
    children: [
     
      { path: "/onboarding", element: <Onboarding /> },
      { path: "/selectTarot", element: <SelectTarotista /> },
      { path: "/selectPlan", element: <PlanSelect /> },
      { path: "/PlanPaid/:plan", element: <Plan /> },
      { path: "/pago-exitoso", element: <PagoExitoso /> },
      { path: "/chat", element: <ChatComponent/> },
      { path:"/post/:id", element:<PostDetail />},

      { path: "/tarotistaProfile/:nombre", element: <ViewProfileTarotista /> },

      {
        path: "/dashboardUser",
        element: <DashboardUser />,
        children: [
          { index: true, element: <DashboardAll /> },
          { path: "profile", element: <Profile /> },
          {path: 'blog',element: <BlogPosts/> }
        ],
      },
    ],
  },

  /* Rutas protegidas para TAROTISTAS */
  {
    element: <ProtectedTarotRoutes />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          { index: true, element: <DashboardAllTarot /> },
          { path: "profileTarot", element: <UserProfile /> },
          { path: "chats", element: <HistorialConversacionesTarotista /> },
          { path: "create", element: <Entrada /> },
          { path: "statics", element: <Statics /> },
          { path: "coupons", element: <CouponManager /> },
        

        ],
      },
    ],
  },

  /* Página de error para rutas no encontradas */
  { path: "*", element: <ErrorPage /> },
]);

function App() {



  return (

    <PayPalScriptProvider options={{ "client-id": "AeLp0pscZ92wImVEIauH55-QoVaIDLByAW51YziCIUMweUuQAUfpxW15pnnVjxJoaEcqPSL-gedT-lUi", currency: "USD" }}>

    <Suspense fallback={<Spinner />}>
      <RouterProvider router={router} />
      <InstallPrompt />
    </Suspense>
    </PayPalScriptProvider>
  );
}

export default App;
