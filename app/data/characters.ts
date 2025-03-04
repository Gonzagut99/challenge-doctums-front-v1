import {CharacterData} from '../types/character'

// export interface CharacterData {
//     id: number;
//     image: string;
//     avatar: string;
//     profession: string;
//     description: string;
//     color: string;
//     twTextColor: string;
// }

export const charactersData: CharacterData[] = [
    {
        id: 1,
        image: "/assets/characters/characterMale1.png",
        avatar: "/assets/characters/avatars/AvatarMale1.png",
        profession: "Lider Estratégico",
        description:
            "Tiene experiencia en gestión de proyectos y habilidades de liderazgo, como la toma de decisiones y la planificación a largo plazo. Entre sus habilidades se encuentran la resolución de problemas y la comunicación efectiva.",
        preview: { 
            experiencia: [ "Gestión de proyectos" ], 
            habilidades_liderazgo: [ "Toma de decisiones", "Planificación a largo plazo" ], 
            // otras_habilidades: [ "Resolución de problemas", "Comunicación efectiva" ] 
        },
        color: "bg-[#059FFF]",
        twTextColor: "text-[#059FFF]",
    },
    {
        id: 2,
        image: "/assets/characters/characterFemale1.png",
        avatar: "/assets/characters/avatars/AvatarFemale1.png",
        profession: "Analista de Datos",
        description:
            "Debe manejar grandes volúmenes de datos y extraer información valiosa de ellos. Entre sus habilidades blandas sdestacan la atención y la organización, asegurando que cada decisión este respaldada por datos.",
        preview: { 
            manejoDatos: ["Grandes volúmenes", "Información valiosa"], 
            habilidadesBlandas: ["Atención", "Organización"], 
            //decisiones: ["Respaldadas por datos"] 
        },
        color: "bg-[#FB6356]",
        twTextColor: "text-[#FB6356]",
    },
    {
        id: 3,
        image: "/assets/characters/characterMale2.png",
        avatar: "/assets/characters/avatars/AvatarMale2.png",
        profession: "Ing. de Software",
        description:
            "Ideal para proyectos que requieren soluciones técnicas avanzadas. En cuanto a habilidades blandas, es creativo y resiliente, capaz de adaptarse rápidamentea los cambios y aportar nuevas ideas en cada fase del proyecto.",
        preview: { 
            habilidades_técnicas: [ "Soluciones técnicas avanzadas" ], 
            habilidades_blandas: [ "Creatividad", "Resiliencia" ], 
            //adaptabilidad: [ "Adaptación a cambios", "Aportar nuevas ideas" ] 
        },
        color: "bg-[#29AA5B]",
        twTextColor: "text-[#29AA5B]",
    },
    {
        id: 4,
        image: "/assets/characters/characterFemale2.png",
        avatar: "/assets/characters/avatars/AvatarFemale2.png",
        profession: "Comunicadora",
        description:
            "Sus habilidades en gestión de stakeholders y comunicación son claves para mantener a todos informados. Su empatía y capacidad de escuchar hacen que los problemas se resuelvan rápidamente y su carisma genera un ambiente de trabajo positivo.",
        preview: { 
            habilidades_comunicación: [ "Gestión de stakeholders", "Comunicación" ], 
            habilidades_blandas: [ "Empatía", "Escucha activa" ],
            // ambiente_trabajo: [ "Resolución de problemas", "Ambiente de trabajo positivo" ] 
        },
        color: "bg-[#FEE349]",
        twTextColor: "text-[#D8B700]",
    },
    {
        id: 5,
        image: "/assets/characters/characterMale3.png",
        avatar: "/assets/characters/avatars/AvatarMale3.png",
        profession: "Consultor Ágil",
        description:
            "Un facilitador clave en equipos ágiles, ayuda a mantener el enfoque en los objetivos del proyecto mientras asegura la flexibilidad necesaria para adaptarse a los cambios. Es conocido por fomentar la colaboración y un flujo de trabajo eficiente.",
        preview: { 
            metodologías_ágiles: ["Gestor de talento", "Foco en objetivos"], 
            habilidades_blandas: ["Colaboración", "Adaptabilidad"], 
            //flujo_trabajo: ["Eficiencia en procesos", "Gestión de cambios"]
        },
        color: "bg-[#B74CF4]",
        twTextColor: "text-[#B74CF4]",
    },
    {
        id: 6,
        image: "/assets/characters/characterFemale3.png",
        avatar: "/assets/characters/avatars/AvatarFemale3.png",
        profession: "Gestora de Riesgos",
        description:
            "Experta en identificar, analizar y mitigar riesgos dentro de los proyectos. Su enfoque proactivo garantiza la continuidad operativa y la calidad del trabajo. En habilidades blandas, destaca por su pensamiento crítico y su habilidad para anticiparse a problemas futuros.",
        preview: { 
            manejo_riesgos: ["Identificación de riesgos", "Mitigación proactiva"], 
            habilidades_blandas: ["Pensamiento crítico", "Anticipación a problemas"],
            //garantía_calidad: ["Continuidad operativa", "Gestión eficiente"]
        },
        color: "bg-[#FEA221]",
        twTextColor: "text-[#FEA221]",
    },
];