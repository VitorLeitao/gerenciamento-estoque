"use client";
import React, { ReactNode } from 'react';

const Footer: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <div>
            <footer className="bg-gray-800 text-white p-4 text-center">
                Feito por Vitor Modesto Leitão
            </footer>
            {children}
        </div>
    );
};

export default Footer;
