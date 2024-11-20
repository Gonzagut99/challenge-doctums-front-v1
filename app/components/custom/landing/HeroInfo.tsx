import React from "react";

const HeroInfo = () => {
        return (
            <section className="relative pt-8 mx-auto w-[90%] md:w-[85%] bg-white ">
                <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                    <div className="mr-auto md:mr-12 place-self-center lg:col-span-7">
                        <h1 className="max-w-2xl mb-8 text-4xl font-serif md:text-5xl xl:text-6xl dark:text-white">
                            Para <span className="text-yellowDark">Educadores</span>
                        </h1>
                        <p className="max-w-2xl mb-6 font-light font-montserrat text-black lg:mb-8 md:text-lg lg:text-xl">
                        Challenge ofrece a los educadores una herramienta avanzada que puede integrarse en su currículo como una simulación realista para desarrollar habilidades empresariales en estudiantes. Los docentes pueden elegir entre distintas modalidades para adaptar el juego a sus objetivos de aprendizaje.
                        </p>
                        
                        <a
                            href="#"
                            className="inline-flex text-celeste items-center justify-center py-3 text-base font-medium underline decoration-2 font-montserrat text-center focus:ring-4 focus:ring-gray-100"
                        >
                            Prueba la Nueva Experiencia
                        </a>
                    </div>
                    <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                        <img
                            className="object-cover w-full h-96 rounded-lg lg:rounded-lg [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]"
                            src="/assets/landing/img/estudiantes.jpg"
                            alt="mockup"
                        />
                    </div>
                </div>
            </section>
        );
    };

export default HeroInfo;
