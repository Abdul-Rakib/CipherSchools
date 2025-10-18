// src/components/NavBar.js
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "flowbite";
import { initFlowbite } from "flowbite";
import Sidebar from "./sideBar";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/globalContext";
import { FaUserAlt } from 'react-icons/fa';
import BottomBar from "./bottomBar";

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
              <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">

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
      <BottomBar />
    </>
  );
};

export default NavBar;
