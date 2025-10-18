import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="text-6xl font-bold text-[#229799] mb-4">404</div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h1>
            <p className="text-gray-500 mb-6">Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="px-6 py-2 bg-[#229799] text-white rounded-full font-medium hover:bg-[#229799] transition">Go Home</Link>
        </div>
    );
};

export default PageNotFound;
