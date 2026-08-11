import React from 'react';

const Header = () => {
  return (
    <header className="bg-ao3-red text-white py-4 px-6 shadow-md border-b-4 border-ao3-darkred">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold italic tracking-wider">
          <span className="text-white">my</span><span className="text-gray-200">Arkived</span>
        </h1>
        <nav className="hidden md:flex space-x-6 text-sm font-semibold">
          <a href="#" className="hover:underline">Fandoms</a>
          <a href="#" className="hover:underline">Browse</a>
          <a href="#" className="hover:underline">Search</a>
          <a href="#" className="hover:underline">About</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
