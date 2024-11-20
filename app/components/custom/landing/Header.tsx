import React, { useState } from "react";
import { ButtonContact } from "./Buttons";

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="relative my-2 w-[84%] lg:w-[95%] mx-auto justify-center rounded-lg top-0 left-0 w-full z-50 backdrop-blur-md bg-black/80">
      <nav
        className="mx-auto  flex max-w-7xl mx-auto items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1">
            <span className="sr-only">Your Company</span>
            <img
              className="h-8 w-auto"
              src="/assets/landing/logo_doctums.png"
              alt="Logo"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300"
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <a href="#" className="text-lg font-light font-montserrat text-white">
            Beneficios
          </a>
          <a href="#" className="text-lg font-light font-montserrat text-white">
            Reglas del juego
          </a>
          <a href="#" className="text-lg font-light font-montserrat text-white">
            Precios
          </a>
          <a href="#" className="text-lg font-light font-montserrat text-white">
            Contacto
          </a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <ButtonContact>Contactanos</ButtonContact>
        </div>
      </nav>
    </header>
  );
};

export { Header };
