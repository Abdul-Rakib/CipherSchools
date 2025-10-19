import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  FaTimes,
  FaHome,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaCog,
  FaSignOutAlt,
  FaWhatsapp,
  FaShieldAlt,
  FaReceipt,
  FaChartLine,
  FaBook,
  FaBars,
  FaArrowLeft,
  FaPhoneAlt,
  FaHeadset
} from 'react-icons/fa';
import { GlobalContext } from '../../context/globalContext';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { isLoggedIn } = useContext(GlobalContext);
  const { logout } = useAuth();

  const message = encodeURIComponent(
    `Name: ${"N/A"}\nMobile: ${"N/A"}\nEmail: ${"N/A"}\n\nHello Admin of PrintLabs,\nCould you please assist me?`
  );
  const whatsappLink = `https://wa.me/919883084820?text=${message}`;

  const menuItems = [
    { label: 'Home', icon: FaHome, to: '/', visible: true },
    { label: 'Customer Support', icon: FaHeadset, to: '/support', visible: true },
    { label: 'Login', icon: FaSignInAlt, to: '/login', visible: !isLoggedIn },
    { label: 'Create Account', icon: FaUserPlus, to: '/register', visible: !isLoggedIn },
    { label: 'Dashboard', icon: FaChartLine, to: '/profile', visible: isLoggedIn },
    { label: 'Privacy Policy', icon: FaShieldAlt, to: '/privacypage', visible: true },
    {
      label: 'Sign Out', icon: FaSignOutAlt, onClick: () => {
        logout();
      }, visible: isLoggedIn
    }
  ];

  return (
    <>
      <div>
        <FaBars onClick={toggleSidebar} className="text-2xl text-gray-600 cursor-pointer" />

        {/* Overlay */}
        <div
          className={`fixed inset-0 z-50 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={toggleSidebar}
        >
          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-[70%] md:w-[30%] bg-white shadow-2xl p-6 z-50 overflow-y-auto transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} rounded-tr-xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-ribbon transition-colors"
              onClick={toggleSidebar}
            >
              <FaArrowLeft className="text-2xl" />
            </button>

            {/* User Info */}
            {isLoggedIn && (
              <Link to='/profile'
                onClick={toggleSidebar}
                className="flex items-center space-x-2 mb-8 border-ribbon pb-4 bg-background rounded-lg mt-6 p-2">
                <div className="w-12 h-12 rounded-full px-4 bg-background flex items-center justify-center shadow">
                  <FaUser className="text-gray-600" />
                </div>
                <div>
                  <h2 className="text-gray-600 font-semibold">Welcome Dear,</h2>
                  <p className="text-gray-600 text-xs">Developer</p>
                </div>
              </Link>
            )}

            {/* Menu Items */}
            <ul className="space-y-2">
              {menuItems
                .filter(item => item.visible)
                .map((item, index) => {
                  const commonClasses = `
                  flex items-center 
                  w-full 
                  p-3 
                  rounded-lg 
                  transition-colors 
                  text-gray-600
                  hover:bg-background
                `;

                  const renderItem = item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${commonClasses}`}
                    >
                      <item.icon className="mr-3 text-ribbon dark:text-icons text-xl" />
                      {item.label}
                    </a>
                  ) : item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className={`${commonClasses} text-left ${item.label === 'Sign Out' ? 'bg-background shadow hover:bg-red-500/30' : ''}`}
                    >
                      <item.icon className="mr-3 text-ribbon dark:text-icons" />
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      to={item.to}
                      className={`${commonClasses}`}
                      onClick={toggleSidebar}
                    >
                      <item.icon className="mr-3 text-icons" />
                      {item.label}
                    </Link>
                  );

                  return (
                    <li key={index}>
                      {renderItem}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
