import { Form } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import { Button2 } from "~/components/custom/Button2";

interface CharacterData {
    id: number;
    image: string;
    profession: string;
    description: string;
    color: string;
}

const charactersData: CharacterData[] = [
    {
        id: 1,
        image: "/assets/characters/characterMale1.png",
        profession: "Lider Estratégico",
        description:
            "Tiene experiencia en gestión de proyectos y habilidades de liderazgo, como la toma de decisiones y la planificación a largo plazo. Entre sus habilidades se encuentran la resolución de problemas y la comunicación efectiva.",
        color: "bg-[#059FFF]",
    },
    {
        id: 2,
        image: "/assets/characters/characterFemale1.png",
        profession: "Analista de Datos",
        description:
            "Debe manejar grandes volúmenes de datos y extraer información valiosa de ellos. Entre sus habilidades blandas sdestacan la atención y la organización, asegurando que cada decisión este respaldada por datos.",
        color: "bg-[#FB6356]",
    },
    {
        id: 3,
        image: "/assets/characters/characterMale2.png",
        profession: "Ing. de Software",
        description:
            "Ideal para proyectos que requieren soluciones técnicas avanzadas. En cuanto a habilidades blandas, es creativoy resiliente, capaz de adaptarse rápidamentea los cambios y aportar nuevas ideas en cada fase del proyecto.",
        color: "bg-[#29AA5B]",
    },
    {
        id: 4,
        image: "/assets/characters/characterFemale2.png",
        profession: "Comunicadora",
        description:
            "Sus habilidades en gestión de stakeholders y comunicación son claves para mantener a todos informados. Su empatía y capacidad de escuchar hacen que los problemas se resuelvan rápidamente y su carisma genera un ambiente de trabajo positivo.",
        color: "bg-[#FEE349]",
    },
];

function chooseCharacter() {
    return (
        <article className="h-full w-full backdrop-blur-[2px] bg-white/70 relative z-10 py-4 px-8 flex flex-col gap-6">
            <section>
                <header className="flex justify-center relative">
                    <img
                        src="/assets/buttons/BackButton.png"
                        alt="Back Button"
                        className="absolute left-0 size-16"
                    />
                    <h1 className="font-dogica-bold text-zinc-900 text-balance text-3xl text-center px-4 py-2 bg-white/80 w-fit rounded-md border-zinc-900 border-[4px] shadow-lg">
                        ESCOGE TU PERSONAJE
                    </h1>
                </header>
            </section>
            <section>
                <Form className="flex flex-col gap-4 items-center" method="post" action="/home/chooseCharacter">
                    <div className="flex gap-4 items-center justify-center">
                        <label htmlFor="name" className="text-2xl font-easvhs">
                            Ingresa tu nombre:
                        </label>
                        <div className="relative w-fit">
                            <img
                                src="/assets/components/input.png"
                                alt="input"
                                className="absolute inset-0 w-full object-fill h-[3.5rem]"
                            />
                            <input
                                type="text"
                                name="name"
                                className="bg-transparent relative font-easvhs text-center w-80 h-[3.5rem] px-4 text-xl border-none active:border-none ring-0 focus:ring-0 active:ring-0 outline-none focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 grid-rows-1 gap-3">
                        {
                            charactersData.map((character) => (
                                <CharacterCard
                                    key={character.id}
                                    data={character}
                                />
                            ))
                        }
                    </div>
                    <div className="flex justify-center">
                        <Button2 className="font-easvhs text-2xl text-white">
                            COMENZAR
                        </Button2>
                    </div>
                </Form>
            </section>
        </article>
    );
}
interface CharacterCardProps {
    data: CharacterData;
}
export const CharacterCard = ({
    data
}: CharacterCardProps) => {
    const {
        image,
        profession,
        description,
        color,
        id
    } = data;
    return (
        <div className="w-[12rem] flex flex-col gap-2">
            <input type="radio" name="character" value={id} id={`character-${data.id}`} className="hidden peer" />
            <header className="px-4 py-1 border-zinc-900 border-[3px] rounded-sm bg-white peer-checked:bg-gray-300">
                <h3 className="font-easvhs text-base text-center">
                {profession.toUpperCase()}
                </h3>
            </header>
            <div className="flex flex-col h-full">
                <figure className={twMerge("h-44 flex justify-center border-zinc-900 border-[3px] rounded-sm px-2", color)}>
                <img
                    src={image}
                    alt={profession}
                    className="object-contain"
                />
                </figure>
                <div className="p-2 border-zinc-900 border-[3px] rounded-sm bg-white border-t-0 h-full">
                <p className="font-easvhs text-[10px] text-pretty">
                    {description}
                </p>
                </div>
            </div>
        </div>
    );
};

export default chooseCharacter;
