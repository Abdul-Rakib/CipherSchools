import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaGithub
} from 'react-icons/fa';
import { FiCode } from 'react-icons/fi';

const SocialLink = ({ href, icon: Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-blue-400 transition-colors"
  >
    <Icon className="w-6 h-6" />
  </a>
);

const Footer = () => {
  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com' },
    { icon: FaTwitter, href: 'https://twitter.com' },
    { icon: FaYoutube, href: 'https://youtube.com' },
  ];

  const quickLinks = [
    { text: 'Login', path: '/login' },
    { text: 'Register', path: '/register' },
    { text: 'Dashboard', path: '/dashboard' }
  ];

  const resources = [
    { text: 'Documentation', path: '/docs' },
    { text: 'Tutorials', path: '/tutorials' },
    { text: 'API Reference', path: '/api' }
  ];

  const legal = [
    { text: 'Privacy Policy', path: '/privacy-policy' },
    { text: 'Terms & Conditions', path: '/terms-and-condition' },
    { text: 'License', path: '/license' }
  ];

  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 border-t border-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <FiCode size={24} className="text-blue-400" />
              <span className="text-xl font-bold text-white">React IDE</span>
            </div>
            <p className="text-sm mb-4 text-gray-400 leading-relaxed">
              Build React applications directly in your browser. Professional IDE with live preview, Monaco editor, and instant setup.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <FaEnvelope className="text-blue-400" />
              support@reactide.dev
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FaPhone className="text-blue-400" />
              Available 24/7
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h6 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">
                Quick Links
              </h6>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h6 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">
                Resources
              </h6>
              <ul className="space-y-2">
                {resources.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h6 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">
                Legal
              </h6>
              <ul className="space-y-2">
                {legal.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} React IDE. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Built with ❤️ for developers
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 mr-2">Follow us:</span>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <SocialLink key={index} {...social} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
