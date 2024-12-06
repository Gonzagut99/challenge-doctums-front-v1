import { useState } from "react";
import { ButtonContact } from "./Buttons";
import { Link, NavLink } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";

const routes = [
    {
        name: "Beneficios",
        href: "/landing-page#benefits",
    },
    {
        name: "Precios",
        href: "/landing-page#pricing",
    },
    {
        name: "Reglas del juego",
        href: "/landing-page/gameRules",
    },
    {
        name: "Iniciar sesión",
        href: "/landing-page/sign-in",
    }
]

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className={
        twMerge(
            "fixed inset-0 max-h-16 my-2 lg:w-[95%] mx-auto justify-center rounded-lg w-full z-20 backdrop-blur-md bg-black/60 ", !isOpen&& "w-fit lg:w-fit mx-0 ml-4"
        )
    }>
      <nav
        className={
            twMerge(
                "mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-8 transition-all duration-1000", !isOpen && "w-fit px-4 lg:px-4 justify-start mx-0"
            )
        }
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to={"/landing-page"} className="-m-1.5 p-1">
            <span className="sr-only">Your Company</span>
            <img
              className="h-8 w-auto"
              src="/assets/landing/logo_doctums.png"
              alt="Logo"
            />
          {/*  */}</Link>
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
        {
            isOpen && <>
                <div className="hidden lg:flex lg:gap-x-12">
                    {routes.map((route) => (
                        <NavLink
                        key={route.href}
                        to={route.href}
                        className={
                            ({ isActive }) => twMerge("text-base font-medium text-gray-300 hover:text-gray-50 transition-all font-montserrat", isActive ? "text-gray-50 font-bold" : "")
                        }
                        >
                        {route.name}
                        </NavLink>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <ButtonContact>Contactanos</ButtonContact>
                </div>
            </>
        }
        <button className="p-2 border-[3px] border-yellowDark bg-yellowDark hover:bg-zinc-900 text-zinc-900 hover:text-zinc-50 rounded-full transition-all ml-2" onClick={
            ()=>setIsOpen((prev)=>!prev)
        }>
            {
                isOpen ? <PanelRightOpen></PanelRightOpen> : <PanelLeftOpen></PanelLeftOpen>
            }
        </button>
      </nav>
    </header>
  );
};

export { Header };
