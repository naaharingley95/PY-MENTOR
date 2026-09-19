import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none transition-all flex items-center justify-center border border-transparent hover:border-slate-700/80 cursor-pointer"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <FiSun className="h-5 w-5 text-amber-400 animate-pulse" />
      ) : (
        <FiMoon className="h-5 w-5 text-indigo-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
