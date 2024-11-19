const HeroSection = () => {
    return (
      <div className="fixed top-0 w-full">
        {/* Hero Background */}
        
          <img
            src="/assets/landing/img/hero-section.png" // Sustituye con tu imagen
            alt="Hero Background"
            className="w-full object-cover md:h-[660px]"
          />
       
  
        {/* Contenido del Hero */}
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="text-center text-white max-w-3xl px-6">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">Challenge</h1>
            <p className="text-lg lg:text-2xl mb-6">
              Conviértete en Líder de Proyecto y Desafía tus Habilidades en el Mundo Empresarial
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default HeroSection;
  