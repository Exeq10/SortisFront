import { lazy,Suspense } from "react"

import { createBrowserRouter,RouterProvider } from "react-router-dom";
import CardDorso from "./components/CardDorso";
import Oboarding from "./pages/User/Oboarding";
import Onboarding from "./pages/User/Oboarding";
import Spinner from "./components/Spinner";
import SelectTarotista from "./pages/User/SelectTarotista";
import InstallPrompt from "./components/InstallPrompt";


const Landing =  lazy(() => import('./pages/User/Landing'))
const Register =  lazy(() => import('./pages/User/Register'))
const Login =  lazy(() => import('./pages/User/Login'))
const DashboardUser =  lazy(() => import('./pages/User/DasboardUser'))


/* Sección tarotistas */
const LoginTarot =  lazy(() => import('./pages/Tarotista/LoginTarot'))




function App() {

  const router = createBrowserRouter([
    {
      path: "/menu",
      element: (
      
          <DashboardUser/>
        
      ),
    },
   
    {
      path: "/register",
      element: (
       
          <Register />
       
      ),
    },
    {
      path: "/login",
      element: (
      
          <Login />
       
      ),
    },
    {
      path: "/loginTarot",
      element: (
      
          <LoginTarot />
       
      ),
    },
    {
      path: "/",
      element: (
      
         <Landing/>
       
      ),
    },
    {
      path: "/onboarding",
      element: (
       
         <Onboarding/>
      
      ),
    },
    {
      path: "/selectTarot",
      element: (
       
         <SelectTarotista/>
      
      ),
    },
   
   
  ]);

 

  return (
    <>
     <Suspense fallback = { <Spinner/> }>

     <RouterProvider router={router} />

     <InstallPrompt/>
     </Suspense>
    
    </>
  )
}

export default App
