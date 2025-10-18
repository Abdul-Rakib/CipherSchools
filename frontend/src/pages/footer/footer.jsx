import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaWhatsapp,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';

const SocialLink = ({ href, icon: Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-600 hover:text-[#229799] transition-colors"
  >
    <Icon className="w-6 h-6" />
  </a>
);

const Footer = () => {
  const socialLinks = [
    { icon: FaInstagram, href: 'https://www.instagram.com/coursemate.ai' },
    { icon: FaYoutube, href: 'https://www.youtube.com/@coursemate' },
    { icon: FaTwitter, href: 'https://twitter.com/coursemate_ai' },
  ];

  const quickLinks = [
    { text: 'Login', path: '/login' },
    { text: 'Register', path: '/register' },
    { text: 'Contact', path: '/contact' }
  ];

  const importantPages = [
    { text: 'Privacy Policy', path: '/privacy-policy' },
    { text: 'Terms & Conditions', path: '/terms-and-condition' },
    { text: 'Refund Policy', path: '/refund-policy' }
  ];

  const paymentMethods = [
    { text: 'Paytm', imgPath: '/payments/paytm.png' },
    { text: 'PhonePe', imgPath: '/payments/phonepe.png' },
    { text: 'Google Pay', imgPath: '/payments/gpay.png' },
    { text: 'UPI', imgPath: '/payments/upi.png' },
  ];

  return (
    <footer className="bg-gray-50 py-10 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-wrap justify-between">
          {/* Company Info */}
          <div className="w-full md:w-1/3 mb-6">
            <div className="font-bold text-2xl mb-4">
              Course<span className="text-[#229799]">Mate</span>
            </div>
            <p className="text-sm mb-4 text-gray-600">
              Transform your lectures, meetings, and podcasts into structured notes.
              AI-powered transcription and summarization made simple.
            </p>
            <p className="mb-4 text-sm flex items-center gap-2 text-gray-600">
              <FaPhone />
              +91 98830 84820 | Punjab, India
            </p>
            <p className="mb-4 text-sm flex items-center gap-2 text-gray-600">
              <FaEnvelope />
              support@coursemate.ai
            </p>
          </div>

          {/* Links Section */}
          <div className="w-full md:w-1/3 flex justify-around mb-6">
            {/* Quick Links */}
            <div className="w-1/2 pr-4">
              <h6 className="font-bold text-sm text-gray-700 mb-3 border-b border-gray-200 pb-2">
                Quick Links
              </h6>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-[#229799] transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Pages */}
            <div className="w-1/2">
              <h6 className="font-bold text-sm text-gray-700 mb-3 border-b border-gray-200 pb-2">
                Important Pages
              </h6>
              <ul className="space-y-2">
                {importantPages.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-[#229799] transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social and Payment Section */}
          <div className="w-full md:w-1/4">
            {/* Social Media */}
            <div className="mb-6 hidden md:block">
              <h6 className="font-bold text-sm text-gray-700 mb-3 border-b border-gray-200 pb-2">
                Connect With Us
              </h6>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <SocialLink key={index} {...social} />
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h6 className="font-bold text-sm text-gray-700 mb-3 border-b border-gray-200 pb-2">
                Payment Methods
              </h6>
              <div className="grid grid-cols-5 gap-3">
                {paymentMethods.map((method, index) => (
                  <img
                    key={index}
                    src={method.imgPath}
                    alt={method.text}
                    className="w-12 h-12 object-contain"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <hr className="my-6" />
        <div className="text-center text-sm pb-8 md:pb-0">
          <small>
            All Rights Reserved © {new Date().getFullYear()} |
            <Link to="/" className="text-[#229799] hover:text-[#229799] ml-1">
              CourseMate
            </Link>
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
