"use client";
import React, { ReactNode } from 'react';

const NavBar: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div>
      <nav className="bg-gray-800 p-7">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-2xl font-bold">Free Lance</h1>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300">Home</a>
              <a href="#" className="text-white hover:text-gray-300">Ofertar</a>
              <a href="#" className="text-white hover:text-gray-300">Sair</a>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default NavBar;
