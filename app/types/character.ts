// { "experiencia": [ "Gestión de proyectos" ], "habilidades_liderazgo": [ "Toma de decisiones", "Planificación a largo plazo" ], "otras_habilidades": [ "Resolución de problemas", "Comunicación efectiva" ] }
export interface CharacterData {
    id: number;
    image: string;
    avatar: string;
    profession: string;
    preview: {
        [key: string]: string[];
    };
    description: string;
    color: string;
    twTextColor: string;
}