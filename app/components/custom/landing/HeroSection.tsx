const HeroSection = () => {
  return (
      <div 
          className="absolute top-0 w-full h-[520px] md:h-[660px] bg-cover bg-center" 
          style={{ backgroundImage: 'url(/assets/landing/img/hero-section.png)' }}
      >
          <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
          
          <div className="relative z-10 md:mx-12 flex items-end justify-start h-full">
              <div className="text-white max-w-3xl px-6">
                  <h1 className="text-4xl font-serif lg:text-6xl font-medium mb-4">Challenge</h1>
                  <p className="text-lg lg:text-2xl mb-8 font-montserrat font-light">
                      Conviértete en Líder de Proyecto y Desafía tus Habilidades en el Mundo Empresarial
                  </p>
              </div>
          </div>
      </div>
  );
};

  
  export default HeroSection;
  