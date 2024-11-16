/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { WhiteContainer } from "~/components/custom/WhiteContainer";
import { twMerge } from "tailwind-merge";
import { ButtonDices } from "~/components/custom/ButtonDices";
import { useRef, useState, useEffect } from "react";
import { Outlet, json, replace, useNavigate, useSubmit } from "@remix-run/react";

import { useLiveLoader } from "~/utils/use-live-loader";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { globalWebSocketService } from "~/services/ws";
import { GameStartMessage, Player, TurnOrder } from "~/types/methods_jsons/startGameResponse";
import { charactersData } from "~/data/characters";
import { getFormDataFromSearchParams } from "remix-hook-form";
import { TurnOrderStage } from "~/types/methods_jsons/turnOrderStage";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const player = globalWebSocketService.getCurrentPlayer();
    const gameStateMethod = globalWebSocketService.getStageMethod();
    const currentPlayerTurnId = globalWebSocketService.getCurrentPlayerTurn();

    if(gameStateMethod == "start_game") {
        const gameState = globalWebSocketService.getGameState<GameStartMessage>();
        return json({player, gameState, currentPlayerTurnId });
    }

    if(gameStateMethod == "turn_order_stage") {
        const gameState = globalWebSocketService.getGameState<TurnOrderStage>();
        const diceResults = gameState.turns_order.find((turn) => turn.playerId === player?.id)?.dices;
        return json({player, gameState, diceResults, currentPlayerTurnId });
    }
    const gameState: any = { message: "No game state found" };
    const response: any = {player, gameState, currentPlayerTurnId }
    return json(response);
}

export const action = async({request}: ActionFunctionArgs) => {
    // GET THE DATA FROM THE submit called in the component
    const formData = await request.formData();
    const method = formData.get("method");
  
    if(method == "turn_order_stage") {
        globalWebSocketService.rollDices();
    }
    
    return json({ message: "Dices rolled" });
}



export default function Index() {
    const loaderData = useLiveLoader<typeof loader>();
    const gameInitData = loaderData.gameState;
    const player = loaderData.player;
    const currentPlayerTurnId = loaderData.currentPlayerTurnId;
    const navigate = useNavigate();
    const gameCanvasRef = useRef(null); // Referencia para el contenedor del canvas de Phaser
    const gameInstanceRef = useRef<Phaser.Game | null>(null); // Mantén una referencia única para el juego

    //const [gameInstance, setGameInstance] = useState<Phaser.Game | null>(null); // Estado para controlar la instancia del juego

    const submit = useSubmit();

    const [dicesResult, setDicesResult] = useState<DicesResult | null>(null);
    const handleOrderTurn = () => {
        // if(loaderData.dicesResults) {
        //     setDicesResult(loaderData.dicesResults as );
        // }
        const formData = new FormData();
        formData.append("method", "turn_order_stage");
        submit(
            formData,
            {
                method: "post"
            }
        )
    };

    
    useEffect(() => {
        let isGameInitialized = false; // Variable para controlar la inicialización

        if (typeof window !== "undefined" && gameCanvasRef.current && !isGameInitialized) {
             const loadMainScene = async () => {
                const { MainScene } = await import("~/game/scenes/MainScene"); // Importación dinámica

                const config = {
                    type: Phaser.AUTO,
                    width: 790,
                    height: 440,
                    backgroundColor: undefined,
                    transparent: true,
                    parent: gameCanvasRef.current, 
                    scene: MainScene, 
                    physics: {
                        default: "arcade",
                        arcade: {
                            debug: true,
                            gravity: { x: 0, y: 0 },
                        },
                    },
                };

                // Crea la instancia del juego de Phaser y almacénala en una referencia
                if (!gameInstanceRef.current) {
                    gameInstanceRef.current = new Phaser.Game(config);
                    isGameInitialized = true;
                }
            };
            loadMainScene().catch((error) => {
                console.error("Error loading MainScene:", error);
            });
        }
        return () => {
            // Limpia la instancia del juego al desmontar el componente
            if (gameInstanceRef.current) {
                gameInstanceRef.current.destroy(true);
                gameInstanceRef.current = null;
            }
        };


    }, []);


    return (
        <article className="relative z-20 h-full w-full bg-gradient-to-b from-sky-500 to-sky-100 p-2 flex flex-col gap-2">
            <section className="flex justify-center">
                <WhiteContainer>
                    <span className="text-sm text-zinc font-dogica-bold px-5">
                        {gameInitData.message}
                    </span>
                </WhiteContainer>
            </section>
            <section className="flex">
                <div id='GameCanvas' ref={gameCanvasRef} className="w-[800px] h-[442px]">

                </div>
                <div className="flex flex-col gap-1">
                    {gameInitData.turns_order.map((playerTurn: TurnOrder) => {
                        
                        if (playerTurn?.playerId === player?.id) {
                            return (
                                <CurrentUserCard
                                    key={playerTurn.playerId}
                                    player={playerTurn}
                                />
                            );
                        } else {
                            return (
                                <PlayerCard
                                    key={playerTurn.playerId}
                                    player={playerTurn}
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
                    <ButtonDices onClick={handleOrderTurn}>
                        <span className="text-white font-easvhs">
                            {currentPlayerTurnId === player?.id 
                                ?  (gameInitData.method == "start_game" || gameInitData.method == "turn_order_stage") 
                                    ? "Define Tu orden de turno" 
                                    : "Espera"
                                : "Esperar"
                            }
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
            <Outlet></Outlet>
        </article>
    );
}

interface DicesResult {
    userId: string;
    diceNumber: number;
    result: number[];
    total: number;
}

export interface GameControlButton {
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
        control: "myEfficiencies",
    },
    {
        icon: "/assets/icons/resourcesIcon.png",
        title: "Ver Recursos",
        description:
            "Herramienta, tiempo y equipo humano necesarios para ejecutar tus proyectos.",
        control: "myResources",
    },
    {
        icon: "/assets/icons/productsIcon.png",
        title: "Ver Productos",
        description:
            "Objetos o mejoras que, una vez adquiridos te ayudarán a ganar más puntos en futuras etapa.",
        control: "myProducts",
    },
    {
        icon: "/assets/icons/projectsIcon.png",
        title: "Ver Proyectos",
        description:
            "Misiones o tareas que, al completarse, te otorgan productos.",
        control: "myProjects",
    },
];

// const gamePlayerData: GameStartMessage = {
//     method: "start_game",
//     status: "success",
//     message: "¡El juego ha comenzado!",
//     current_turn: "45646e2d-178a-4c02-942c-347e352bdc76",
//     legacy_products: ["2", "7", "22"],
//     player: {
//         id: "45646e2d-178a-4c02-942c-347e352bdc76",
//         name: "Noelia",
//         avatarId: "1",
//         budget: 100000,
//         score: 0,
//         efficiencies: {
//             1: 5,
//             2: 0,
//             3: 0,
//             4: 5,
//             5: 0,
//             6: 0,
//             7: 5,
//             8: 0,
//             9: 0,
//             10: 0,
//             11: 0,
//             12: 5,
//         },
//     },
//     turns_order: [
//         {
//             playerId: "45646e2d-178a-4c02-942c-347e352bdc76",
//             name: "Noelia",
//             avatarId: "1",
//             dices: [5, 1],
//             total: 6,
//         },
//         {
//             playerId: "b4965265-9ce7-4a93-b1ed-5d48d4c652d5",
//             avatarId: "2",
//             name: "Aubrey",
//             dices: [2, 1],
//             total: 3,
//         },
//     ],
// };

    

interface PlayerCardIcons {
    field: string;
    icon: string;
    tw_bg: string;
    text: string;
}

const playerCardIcons = (playerData: Player): PlayerCardIcons[] => {
    return [
        {
            field: "budget",
            icon: "/assets/icons/cashIcon.png",
            tw_bg: "bg-[#99C579]",
            text: playerData.budget.toString(),
        },
        {
            field: "score",
            icon: "/assets/icons/scoreIcon.png",
            tw_bg: "bg-[#e7c710]",
            text: playerData.score.toString(),
        },
        // {
        //     field: "date",
        //     icon: "/assets/icons/dateIcon.png",
        //     tw_bg: "bg-[#e4675c]",
        //     text: gamePlayerData.date,
        // },
        // {
        //     field: "activeProducts",
        //     icon: "/assets/icons/objectCountIcon.png",
        //     tw_bg: "bg-[#D9D9D9]",
        //     text: gamePlayerData.activeProducts.toString(),
        // },
    ];
};

interface UserCardProps {
    player: TurnOrder;
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
function CurrentUserCard({ player }: UserCardProps) {
    const characterData = charactersData.find(
        (character) => character.id === parseInt(player.avatarId)
    ) ?? charactersData[0];


    return (
        <WhiteContainer className="max-w-[19rem] min-w-[19rem] min-h-44 h-44 ">
            <div className="grid grid-cols-1 grid-rows-[1fr_1fr] max-h-full">
                <header className="flex gap-2 mb-1">
                    <figure
                        className={twMerge(
                            "border-[3px] border-zinc-900 grow aspect-square flex items-center",
                            characterData.color
                        )}
                    >
                        <img
                            className="object-contain aspect-square"
                            src={characterData.image}
                            alt="Avatar imag"
                        />
                    </figure>
                    <div className="w-[13rem] min-w-[13rem]">
                        <p className="font-easvhs text-lg">Tú</p>
                        <div className="grid grid-cols-2 gap-1">
                            {/* {playerCardIcons(player).map((icon) => (
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
                            ))} */}
                        </div>
                    </div>
                </header>
                <div className="flex flex-col">
                    <h4 className="text-[12px] font-easvhs">
                        Proyectos en marcha:
                    </h4>
                    <div className="grow flex items-center">
                        {/* {gamePlayerData.ongoingProjects === 0 ? (
                            <p className="text-[12px] font-easvhs text-center opacity-30 w-full">
                                No tienes proyectos en marcha
                            </p>
                        ) : (
                            <span className="text-[12px] font-easvhs">
                                Tienes {gamePlayerData.ongoingProjects}{" "}
                                proyectos en marcha
                            </span>
                        )} */}
                    </div>
                </div>
            </div>
        </WhiteContainer>
    );
}
function PlayerCard({ player }: UserCardProps) {
    const characterData = charactersData.find(
        (character) => character.id === parseInt(player.avatarId)
    ) ?? charactersData[0];

    
    return (
        <WhiteContainer className="max-w-[19rem] min-w-[19rem]">
            <header className="flex gap-2">
                <figure
                    className={twMerge(
                        "border-[3px] border-zinc-900 aspect-square grow",
                        characterData.color
                    )}
                >
                    <img
                        className="object-contain aspect-square"
                        src={characterData.image}
                        alt="Avatar imag"
                    />
                </figure>
                <div className="w-56 min-w-56">
                    <p className="font-easvhs text-lg">
                        {player.name}
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                        {/* {playerCardIcons(player).map((icon) => {
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
                        })} */}
                    </div>
                </div>
            </header>
        </WhiteContainer>
    );
}
