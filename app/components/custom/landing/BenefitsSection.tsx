
import { ButtonCeleste, ButtonYellow } from "~/components/custom/landing/Buttons";
import { BentoBenefits } from "./BentoGrid";

const BenefitsSection = async () => {
    return (
        <section className="relative mx-auto h-auto w-[90%] md:w-[85%] my-12">
            <h1 className="text-black font-serif text-4xl md:text-5xl mb-8">
                Beneficios para los <span className="text-celeste">Estudiantes</span>
            </h1>
            <p className="mb-10 font-montserrat text-back text-lg md:text-[24px]">
            Este simulador ayuda a los estudiantes a desarrollar competencias clave en gestión y liderazgo de proyectos.
            </p>
            
            <a href="" className="relative md:mr-3 mx-auto">
            <ButtonYellow>Solicitar demo personalizada</ButtonYellow>
            </a>
            <a href="" className="mr-3">
            <ButtonCeleste>Probar juego</ButtonCeleste>
            </a>

        <div className="mt-12 h-auto">
        {await BentoBenefits()}
        </div>
            
        </section>
    );
};
  
export default BenefitsSection;