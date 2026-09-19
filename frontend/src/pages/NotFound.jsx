import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 font-sans text-center px-4">
      <h1 className="text-9xl font-extrabold text-indigo-500 tracking-widest font-mono">404</h1>
      <div className="bg-indigo-600 text-white px-2 text-sm rounded rotate-12 absolute mb-16 select-none">
        Page Not Found
      </div>
      <p className="text-slate-400 text-lg mt-6 mb-8 max-w-md">
        The page you are looking for does not exist or has been moved to another path.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg transition-all"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
