import { FaHome, FaShoppingBag, FaShoppingCart, FaUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const BottomBar = () => {
  const location = useLocation();
  const navItems = [
    {
      icon: <FaHome className="text-xl" />,
      label: 'Home',
      link: '/',
      active: location.pathname === '/'
    },
    {
      icon: <FaShoppingBag className="text-xl" />,
      label: 'Order Again',
      link: '/orders',
      active: location.pathname === '/orders'
    },
    {
      icon: <FaUser className="text-xl" />,
      label: 'Profile',
      link: '/profile',
      active: location.pathname === '/profile'
    },
    {
      icon: <FaShoppingCart className="text-xl" />,
      label: 'Cart',
      link: '/cart',
      active: location.pathname === '/cart'
    }
  ];
  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className={`flex flex-col items-center relative ${item.active ? 'text-[#229799]' : 'text-gray-600'}`}
            style={{ textDecoration: 'none' }}
          >
            <div className="relative">
              {item.icon}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}

      </div>
    </div>
  );
};

export default BottomBar;