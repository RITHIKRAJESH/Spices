import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Retailerdashboard from "./components/retailer/retailerdashboard";
import "bootstrap/dist/css/bootstrap.min.css";
// Lazy load components
const Homepage = React.lazy(() => import("./components/Homepage"));
const LoginForm = React.lazy(() => import("./components/login"));
const UserForm = React.lazy(() => import("./components/register"));
const Admindashboard = React.lazy(() => import("./components/admin/home"));
const FarmerDashboard = React.lazy(() => import("./components/farmer/home"));
const WholesalerDashboard = React.lazy(() => import("./components/wholesaler/home"));

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<UserForm />} />
          <Route path="/admin/*" element={<Admindashboard />} />
          <Route path="/farmer/*" element={<FarmerDashboard />} />
          <Route path="/wholesaler/*" element={<WholesalerDashboard />} />
          <Route path="/retailer/*" element={<Retailerdashboard/>}/>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
