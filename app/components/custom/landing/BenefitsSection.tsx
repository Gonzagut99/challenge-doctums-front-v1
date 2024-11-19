import { BentoCard, BentoGrid } from "~/components/ui/bento-grid";
import { ButtonCeleste, ButtonYellow } from "./Buttons";
import FileTextIcon from "@radix-ui/react-icons/dist/FileTextIcon";
import { BellIcon, CalendarIcon, GlobeIcon, InputIcon } from "@radix-ui/react-icons";

const BenefitsSection = () => {
    return (
        <section className="w-[800px] mx-24 m-8">
            <h1 className="text-black font-serif text-5xl md:text-5xl mb-8">
                Beneficios para los <span className="text-celeste">Estudiantes</span>
            </h1>
            <p className="mb-10 font-montserrat text-back text-[24px]">
            Este simulador ayuda a los estudiantes a desarrollar competencias clave en gestión y liderazgo de proyectos.
            </p>

        <div className="-[400px]">
            <a href="#" className="mr-4">
                <ButtonYellow>Solicitar demo personalizada</ButtonYellow>
            </a>
            <a href="#" className="mr-2">
                <ButtonCeleste>Probar juego</ButtonCeleste>
            </a>
        </div>
        <BentoBenefits />
            
        </section>
    );
};
const features = [
    {
      Icon: FileTextIcon,
      name: "Save your files",
      description: "We automatically save your files as you type.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: InputIcon,
      name: "Full text search",
      description: "Search through all your files in one place.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: GlobeIcon,
      name: "Multilingual",
      description: "Supports 100+ languages and counting.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: CalendarIcon,
      name: "Calendar",
      description: "Use the calendar to filter your files by date.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: BellIcon,
      name: "Notifications",
      description:
        "Get notified when someone shares a file or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];
   
  function BentoBenefits() {
    return (
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    );
  }
export default BenefitsSection;