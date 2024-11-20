import React from "react";
import { BentoCard, BentoGrid} from "~/components/ui/bento-grid";
import {CompetenciaIcon,EstrategiaIcon,ProblemaIcon,RealistaIcon,RecursosIcon} from "~/components/custom/landing/Icons";

   
  const features = [
    {
      Icon: ProblemaIcon,
      name: "Competencia Saludable",
      description: "Los estudiantes aprenden a colaborar y competir, emulando entornos laborales reales.",
      href: "/",
      cta: "Leer más",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: RealistaIcon,
      name: "Resolución de Problemas",
      description: "Los jugadores enfrentan desafíos en tiempo real que requieren decisiones informadas.",
      href: "/",
      cta: "Leer más",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: CompetenciaIcon,
      name: "Simulación Realista",
      description: "Contexto de aprendizaje alineado con los desafíos actuales del entorno empresarial",
      href: "/",
      cta: "Leer más",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: EstrategiaIcon,
      name: "Decisiones Estratégicas",
      description: "Enseña a evaluar oportunidades y riesgos, y a balancear recursos de manera efectiva",
      href: "/",
      cta: "Leer más",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: RecursosIcon,
      name: "Manejo de Recursos",
      description:
        "Los estudiantes aprenden a gestionar los recursos que tienen durante el juego",
      href: "/",
      cta: "Leer más",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];
   
  async function BentoBenefits(): Promise<JSX.Element> {
    return (
      <BentoGrid className="relative lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    );
  }

  export { BentoBenefits };