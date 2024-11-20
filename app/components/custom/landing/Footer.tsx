import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 ml-6 md:mb-0">
            <a href="" className="flex items-center">
              <img src="/assets/landing/logo_doctums.png" className="h-8 me-3" alt="FlowBite Logo" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 p-12">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white font-montserrat">Resources</h2>
              <ul className="text-white font-montserrat font-regular">
                <li className="mb-4">
                  <a href="https://flowbite.com/" className="hover:underline">Flowbite</a>
                </li>
                <li>
                  <a href="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white font-montserrat">Follow us</h2>
              <ul className="text-white font-montserrat font-regular">
                <li className="mb-4">
                  <a href="https://github.com/themesberg/flowbite" className="hover:underline">Github</a>
                </li>
                <li>
                  <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">Discord</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white font-montserrat">Legal</h2>
              <ul className="text-white font-montserrat font-regular">
                <li className="mb-4">
                  <a href="#" className="hover:underline">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-center">
          <span className="text-sm text-white font-montserrat sm:text-center">© 2024. All Rights Reserved.</span>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
