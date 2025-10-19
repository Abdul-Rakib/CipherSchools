// src/components/NavBar.js
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "flowbite";
import { initFlowbite } from "flowbite";
import Sidebar from "./sideBar";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/globalContext";
import { FaUserAlt } from 'react-icons/fa';


const NavBar = () => {
  const location = useLocation();
  const { isLoggedIn } = useContext(GlobalContext)

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initFlowbite();
  }, [isLoggedIn]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const hiddenRoutes = ["/login", "/upload-preview"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <>
      <nav className="">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-4">

          {/* Sidebar component */}
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          <a href="/" className="flex items-center">
            <h2 className="text-2xl font-bold">
              Course<span className="text-[#229799]">Mate</span>
            </h2>
          </a>


          <div className="flex gap-1 md:order-2 items-center space-x-3 md:space-x-0 rtl:space-x-reverse">
            {!isLoggedIn ? (
              <button
                onClick={() => window.location = "/login"}
                className="flex items-center justify-center bg-[#229799] text-white px-4 py-1.5 rounded-full transition-all duration-300">
                <span>Login</span>
              </button>
            ) : (
              <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-3">
                <Link to='/dashboard' className="hidden sm:block">
                  <button className="relative group px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50 overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      IDE
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>
                <Link to='/profile'>
                  <div className="flex items-center space-x-2 bg-background p-2 rounded-lg">
                    <FaUserAlt className="text-alternate text-xl" />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
