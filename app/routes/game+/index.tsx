import { WhiteContainer } from "~/components/custom/WhiteContainer";
import { ConnectedPlayer } from "~/types/connectedPlayer";
import { CharacterData } from "~/types/character";
import { connectedPlayers } from "~/data/connectedPlayers";
import { twMerge } from "tailwind-merge";
import { ButtonDices } from "~/components/custom/ButtonDices";
import { useState } from "react";
import { useNavigate } from "@remix-run/react";

export default function Index() {
    const navigate = useNavigate();

    const possibleDiceResult: DicesResult = {
        userId: "1",
        diceNumber: 5,
        result: [3, 4, 5, 6, 2],
        total: 20,
    };
    const [dicesResult, setDicesResult] = useState<DicesResult | null>(null);
    const handleDiceResult = () => {
        setDicesResult(possibleDiceResult);
    };

    return (
        <article className="relative z-20 h-full w-full bg-gradient-to-b from-sky-500 to-sky-100 p-2 flex flex-col gap-2">
            <section className="flex justify-center">
                <WhiteContainer>
                    <span className="text-sm text-zinc font-dogica-bold px-5">
                        Lanza los dados para definir el orden de turno
                    </span>
                </WhiteContainer>
            </section>
            <section className="flex">
                <div id='GameCanvas' className="w-[800px] h-[442px]">

                </div>
                <div className="flex flex-col gap-1">
                    {gamePlayerData.map((playerData) => {
                        if (playerData.isCurrentPlayer) {
                            return (
                                <CurrentUserCard
                                    key={playerData.connectedPlayer.userId}
                                    gamePlayerData={playerData}
                                />
                            );
                        } else {
                            return (
                                <PlayerCard
                                    key={playerData.connectedPlayer.userId}
                                    gamePlayerData={playerData}
                                />
                            );
                        }
                    })}
                </div>
            </section>
            <section className="flex flex-col gap-2">
                <div className="grid grid-cols-4 gap-2">
                    {gameControlButtons.map((button) => (
                        <WhiteContainer key={button.control} onClick={()=>navigate(`/game/${button.control}`)}>
                            <div className="flex gap-2">
                                <figure className="w-16 min-w-16">
                                    <img
                                        src={button.icon}
                                        alt="Icon"
                                        className="object-contain aspect-square !w-16"
                                    />
                                </figure>
                                <div className="grow">
                                    <h4 className="text-sm font-easvhs">
                                        {button.title}
                                    </h4>
                                    <p className="text-[0.60rem] font-easvhs">
                                        {button.description}
                                    </p>
                                </div>
                            </div>
                        </WhiteContainer>
                    ))}
                </div>
                <div className="flex gap-4 justify-center">
                    <ButtonDices onClick={handleDiceResult}>
                        <span className="text-white font-easvhs">
                            Lanzar Dados
                        </span>
                    </ButtonDices>
                    {dicesResult && (
                        <div className="border-[3px] border-zinc-900 bg-[#6366F1] flex gap-2 items-center justify-center w-fit min-h-[60px] px-4">
                            {dicesResult.result.map((dice) => (
                                // <img key={dice} className="text-white font-easvhs text-lg">{dice}</img>
                                <img
                                    key={dice}
                                    src={`/assets/dices/${dice}.png`}
                                    alt={`dice${dice}`}
                                    className="size-[50px] object-contain"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <div id="modal-container" />    
        </article>
    );
}

interface DicesResult {
    userId: string;
    diceNumber: number;
    result: number[];
    total: number;
}

interface GameControlButton {
    icon: string;
    title: string;
    description: string;
    control: string;
}

const gameControlButtons: GameControlButton[] = [
    {
        icon: "/assets/icons/efficiencyIcon.png",
        title: "Ver Eficiencias",
        description:
            "Habilidades especiales que potencian tu desempeño, aumentando tu capacidad de progreso en el juego.",
        control: "efficiencies",
    },
    {
        icon: "/assets/icons/resourcesIcon.png",
        title: "Ver Recursos",
        description:
            "Herramienta, tiempo y equipo humano necesarios para ejecutar tus proyectos.",
        control: "resources",
    },
    {
        icon: "/assets/icons/productsIcon.png",
        title: "Ver Productos",
        description:
            "Objetos o mejoras que, una vez adquiridos te ayudarán a ganar más puntos en futuras etapa.",
        control: "MyProducts",
    },
    {
        icon: "/assets/icons/projectsIcon.png",
        title: "Ver Proyectos",
        description:
            "Misiones o tareas que, al completarse, te otorgan productos.",
        control: "projects",
    },
];

interface GamePlayerData {
    score: number;
    budget: number;
    isCurrentPlayer: boolean;
    currentTurnPlayerId: string;
    date: string;
    activeProducts: number;
    ongoingProjects: number;
    characterData: CharacterData;
    connectedPlayer: ConnectedPlayer;
}

const gamePlayerData: GamePlayerData[] = [
    {
        score: 120,
        budget: 10050,
        isCurrentPlayer: true,
        currentTurnPlayerId: "1",
        date: "17/09",
        activeProducts: 0,
        ongoingProjects: 0,
        characterData: connectedPlayers[0].characterData,
        connectedPlayer: connectedPlayers[0],
    },
    {
        score: 800,
        budget: 900,
        isCurrentPlayer: false,
        currentTurnPlayerId: "2",
        date: "12/05",
        activeProducts: 0,
        ongoingProjects: 0,
        characterData: connectedPlayers[1].characterData,
        connectedPlayer: connectedPlayers[1],
    },
    {
        score: 1020,
        budget: 2700,
        isCurrentPlayer: false,
        currentTurnPlayerId: "3",
        date: "22/09",
        activeProducts: 0,
        ongoingProjects: 0,
        characterData: connectedPlayers[2].characterData,
        connectedPlayer: connectedPlayers[2],
    },
    {
        score: 350,
        budget: 500,
        isCurrentPlayer: false,
        currentTurnPlayerId: "4",
        date: "13/03",
        activeProducts: 0,
        ongoingProjects: 0,
        characterData: connectedPlayers[3].characterData,
        connectedPlayer: connectedPlayers[3],
    },
];

interface PlayerCardIcons {
    field: string;
    icon: string;
    tw_bg: string;
    text: string;
}

const playerCardIcons = (gamePlayerData: GamePlayerData): PlayerCardIcons[] => {
    return [
        {
            field: "budget",
            icon: "/assets/icons/cashIcon.png",
            tw_bg: "bg-[#99C579]",
            text: gamePlayerData.budget.toString(),
        },
        {
            field: "score",
            icon: "/assets/icons/scoreIcon.png",
            tw_bg: "bg-[#e7c710]",
            text: gamePlayerData.score.toString(),
        },
        {
            field: "date",
            icon: "/assets/icons/dateIcon.png",
            tw_bg: "bg-[#e4675c]",
            text: gamePlayerData.date,
        },
        {
            field: "activeProducts",
            icon: "/assets/icons/objectCountIcon.png",
            tw_bg: "bg-[#D9D9D9]",
            text: gamePlayerData.activeProducts.toString(),
        },
    ];
};

interface UserCardProps {
    gamePlayerData: GamePlayerData;
}

// export interface CharacterData {
//     id: number;
//     image: string;
//     avatar: string;
//     profession: string;
//     description: string;
//     color: string;
//     twTextColor: string;
// }
function CurrentUserCard({ gamePlayerData }: UserCardProps) {
    return (
        <WhiteContainer className="max-w-[19rem] min-w-[19rem] min-h-44 h-44 ">
            <div className="grid grid-cols-1 grid-rows-[1fr_1fr] max-h-full">
                <header className="flex gap-2 mb-1">
                    <figure
                        className={twMerge(
                            "border-[3px] border-zinc-900 grow aspect-square flex items-center",
                            gamePlayerData.characterData.color
                        )}
                    >
                        <img
                            className="object-contain aspect-square"
                            src={gamePlayerData.characterData.image}
                            alt="Avatar imag"
                        />
                    </figure>
                    <div className="w-[13rem] min-w-[13rem]">
                        <p className="font-easvhs text-lg">Tú</p>
                        <div className="grid grid-cols-2 gap-1">
                            {playerCardIcons(gamePlayerData).map((icon) => (
                                <div
                                    key={icon.field}
                                    id={icon.field}
                                    className="flex items-center gap-2 border-2 border-zinc-900"
                                >
                                    <figure
                                        className={twMerge(
                                            icon.tw_bg,
                                            "px-1 h-full flex items-center w-fit"
                                        )}
                                    >
                                        <img
                                            src={icon.icon}
                                            alt="Icon"
                                            className="w-5"
                                        />
                                    </figure>
                                    <span className="font-easvhs text-sm">
                                        {icon.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>
                <div className="flex flex-col">
                    <h4 className="text-[12px] font-easvhs">
                        Proyectos en marcha:
                    </h4>
                    <div className="grow flex items-center">
                        {gamePlayerData.ongoingProjects === 0 ? (
                            <p className="text-[12px] font-easvhs text-center opacity-30 w-full">
                                No tienes proyectos en marcha
                            </p>
                        ) : (
                            <span className="text-[12px] font-easvhs">
                                Tienes {gamePlayerData.ongoingProjects}{" "}
                                proyectos en marcha
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </WhiteContainer>
    );
}
function PlayerCard({ gamePlayerData }: UserCardProps) {
    return (
        <WhiteContainer className="max-w-[19rem] min-w-[19rem]">
            <header className="flex gap-2">
                <figure
                    className={twMerge(
                        "border-[3px] border-zinc-900 aspect-square grow",
                        gamePlayerData.characterData.color
                    )}
                >
                    <img
                        className="object-contain aspect-square"
                        src={gamePlayerData.characterData.image}
                        alt="Avatar imag"
                    />
                </figure>
                <div className="w-56 min-w-56">
                    <p className="font-easvhs text-lg">
                        {gamePlayerData.connectedPlayer.name}
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                        {playerCardIcons(gamePlayerData).map((icon) => {
                            if (
                                icon.field === "date" ||
                                icon.field === "activeProducts"
                            )
                                return;
                            return (
                                <div
                                    key={icon.field}
                                    id={icon.field}
                                    className="flex items-center gap-2 border-2 border-zinc-900"
                                >
                                    <figure
                                        className={twMerge(
                                            icon.tw_bg,
                                            "px-1 h-full flex items-center w-fit"
                                        )}
                                    >
                                        <img
                                            src={icon.icon}
                                            alt="Icon"
                                            className="w-5"
                                        />
                                    </figure>
                                    <span className="font-easvhs text-sm">
                                        {icon.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </header>
        </WhiteContainer>
    );
}
