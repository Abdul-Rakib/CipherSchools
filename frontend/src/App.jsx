import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IDEProvider } from './context/ideContext';

import ProtectedRoute from "./routes/ProtectedRoutes"
import Login from './pages/Auth/login'
import Register from './pages/Auth/register';
import NavBar from './components/navbar/NavBar';
import Homepage from './pages/Homepage';
import Profile from './pages/dashboard/profile';
import Dashboard from './pages/dashboard/projects';
import IDE from './pages/dashboard/ide';
import PrivacyPolicy from './pages/footer/privacyPolicy';
import TermsConditions from './pages/footer/termsConditions';
import RefundPolicy from './pages/footer/refundPolicy';
import PageNotFound from './components/pageNotFount';
import Contact from './pages/footer/contact';

export default function App() {

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <IDEProvider>
      <>
        <NavBar />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute> <Outlet /> </ProtectedRoute>}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ide/:projectId" element={<IDE />} />
          </Route>

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-condition" element={<TermsConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/contact" element={<Contact />} />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </>
    </IDEProvider>
  )
}