/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { useLiveLoader } from "~/utils/use-live-loader";

import { WhiteContainer } from "~/components/custom/WhiteContainer";
import { ButtonDices } from "~/components/custom/ButtonDices";
import { PageContainer } from "~/components/custom/PageContainer";
import {
    Outlet,
    json,
    replace,
    useNavigate,
    useSubmit,
} from "@remix-run/react";

import { Player } from "~/services/http/player";
import { globalWebSocketService, LocalPlayerDynamicInfo } from "~/services/ws";


import {
    GameStartMessage,
    PlayerInitState,
    StartGameTurnPlayerOrder,
} from "~/types/methods_jsons/startGameResponse";
import { charactersData } from "~/data/characters";
import { getFormDataFromSearchParams } from "remix-hook-form";
import {
    TurnOrderStage,
    TurnOrderPlayer,
} from "~/types/methods_jsons/turnOrderStage";
import { StartNewTurn,PlayerInitModifiers, TimeManager } from "~/types/methods_jsons/startNewTurn";
import { 
        TurnEventResults,
        PlayersActionNotification
} from "~/types/methods_jsons";


import GameCanvas from "./_gameCanvas/index";
import { Header } from "~/components/custom/landing/Header";

const gameStateHandlers = {
    start_game: () => globalWebSocketService.getGameState<GameStartMessage>(),
    turn_order_stage: () =>
        globalWebSocketService.getGameState<TurnOrderStage>(),
    start_new_turn: () => globalWebSocketService.getGameState<StartNewTurn>(),
    submit_plan: () => globalWebSocketService.getGameState<TurnOrderStage>(),
    turn_event_flow: () =>
        globalWebSocketService.getGameState<TurnEventResults>(),
    new_turn_start: () => globalWebSocketService.getGameState<StartNewTurn>(),
    notification: () => globalWebSocketService.getGameState<PlayersActionNotification>(),
    days_advanced: () => globalWebSocketService.getGameState<PlayersActionNotification>(),
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const gamePlayersPositions = globalWebSocketService.getGameStateCanvas();
    const localPlayer = globalWebSocketService.getLocalPlayerAvatarInfo();
    const gameStateMethod = globalWebSocketService.getStageMethod();
    const currentPlayerTurnId = globalWebSocketService.getCurrentPlayerTurn();
    const localPlayerDynamicInfo =
        globalWebSocketService.getLocalPlayerDynamicInfo();
    const playersTurnOrder = globalWebSocketService.getDefinedTurnsOrder(); //0 if turnOrderStage has not started
    const localPlayerAdvancedDays = globalWebSocketService.getLocalPlayerDaysAdvanced()
    // const isGameInitialized = globalWebSocketService.getIsGameInitialized(); //Control game canvas initialization
    if (!gameStateMethod || !(gameStateMethod in gameStateHandlers)) {
        return json({ error: "Invalid game state method" }, { status: 400 });
    }

    const gameState =
        gameStateHandlers[gameStateMethod as keyof typeof gameStateHandlers]();
    return json({
        gamePlayersPositions,
        localPlayer,
        gameState,
        currentPlayerTurnId,
        localPlayerDynamicInfo,
        //isGameInitialized,
        playersTurnOrder,
        localPlayerAdvancedDays
    });
};

export const action = async ({ request }: ActionFunctionArgs) => {
    // GET THE DATA FROM THE submit called in the component
    const formData = await request.formData();
    const method = formData.get("method");

    if (method == "turn_order_stage") {
        globalWebSocketService.rollDices();
    }

    if (method == "start_new_turn") {
        globalWebSocketService.startNewTurn();
    }

    if (method == "advance_days") {
        globalWebSocketService.advanceDays();
    }

    return json({ message: "Dices rolled" });
};

export default function _layout() {
    // const fetcher = useFetcher();
    // fetcher.load("/game/gameCanvas");

    // 1st frontstage - 1st backstage
    //charging loader data | gameInitData

    const loaderData: any = useLiveLoader<typeof loader>();
    const genericGameState: GameStartMessage | TurnOrderStage | StartNewTurn =
        loaderData.gameState;
    const playerPositions = loaderData.gamePlayersPositions;
    const localPlayer = loaderData.localPlayer as Player;
    const localPlayerDynamicInfo =
        loaderData.localPlayerDynamicInfo as LocalPlayerDynamicInfo;
    //const isGameInitialized:boolean = loaderData.isGameInitialized;
    const turnsOrder = loaderData.playersTurnOrder as TurnOrderPlayer[];
    // const currentPlayerTurnId =
    //     loaderData.currentPlayerTurnId ?? genericGameState.current_turn;
    const currentPlayerTurnId = loaderData.currentPlayerTurnId;
    // const is_notification = genericGameState.method == "notification"

    // stages states
    const is_start_game_stage = (genericGameState as GameStartMessage)?.is_start_game_stage
    const is_turn_order_stage = (genericGameState as TurnOrderStage)?.is_turn_order_stage
    const turnStage_isTurnOrderStageOver = (genericGameState as TurnOrderStage)?.is_turn_order_stage_over;
    const is_start_new_turn_stage = (genericGameState as StartNewTurn)?.is_new_turn_stage
    

    // 2nd fronstage - 2nd backstage
    //charging turn order stage data
    const turnStage_playerToStartNewTurn = (genericGameState as TurnOrderStage)?.first_player_turn ?? null;
    const turnStage_hasPlayerRolledDices = (genericGameState as TurnOrderStage)
        .this_player_turn_results?.has_player_rolled_dices;
    const turnStage_dicesResult =
        (genericGameState as TurnOrderStage).this_player_turn_results?.dices ??
        null;
        
    //3rd frontstage
    // const [hasThisPlayer_Turn_Started, setThisPlayer_Turn ] = useState(false)
    // const [preNewTurnStage_isOver, setPreNewTurnStage_isOver] = useState(false)
    const [hasPlayerLocallyAdvancedDayd, setPlayerLocallyAdvancedDays] = useState(false)
    const preNewTurnStage_message = (genericGameState as StartNewTurn).message
    const preNewTurnStage_currentTurn = (genericGameState as StartNewTurn).current_turn
    const hasLocalPlayerRolledDicesToAdvanceDays = (genericGameState as PlayersActionNotification).has_player_rolled_dices ?? false

    // 4th frontstage - 3rd backstage
    // const [newTurnStage_isOver, setNewTurnStage_isOver] = useState(true)
    //const newTurnStage_currentTurn = (gameInitData as StartNewTurn).current_turn
    const newTurn_advancedDays = loaderData.localPlayerAdvancedDays
    const newTurnStage_message = (genericGameState as StartNewTurn).message
    const newTurnStage_method = (genericGameState as StartNewTurn).method
    const newTurnStage_thrownDices = (genericGameState as StartNewTurn)?.thrown_dices ?? null
    const newTurnStage_timeManager = (genericGameState as StartNewTurn).time_manager
    const newTurnStage_playerInitModifiers = (genericGameState as StartNewTurn).player

    // 5th frontstage - 4th backstage


    
    // charging react/remix hooks
    const navigate = useNavigate();
    const submit = useSubmit();
    const gameCanvasRef = useRef<HTMLDivElement | null>(null); // Referencia para el contenedor del canvas de Phaser

    const [avatarId, setAvatarId] = useState<string | null>(
        localPlayer?.avatar_id || null
    ); // This data will continously change thanks to live loader


    const [gameData, setGameData] = useState({
        turns_order: [],
        method: "",
        message: "",
    });

    //trigger turn_order_stage event from the backend
    const triggerTurnOrderStage = () => {
        // const currentPlayerOrderTurnId = currentPlayerTurnId;

        if (currentPlayerTurnId === localPlayer?.id) {
            const formData = new FormData();
            formData.append("method", "turn_order_stage");
            submit(formData, {
                method: "post",
            });
        }
    };

    const triggerStartNewTurn = () => {
        const formData = new FormData();
        formData.append("method", "start_new_turn");
        // setPreNewTurnStage_isOver(true)
        submit(formData, {
            method: "post",
        });
    };

    const triggerAdvanceDaysMessage = () => {
        const formData = new FormData();
        formData.append("method", "advance_days");
        submit(formData, {
            method: "post",
        });
    };

    

    console.log(genericGameState)
    console.log("advance days", newTurn_advancedDays)
    console.log("hasLocalPlayerRolledDicesToAdvanceDays", hasLocalPlayerRolledDicesToAdvanceDays)



    return (
        <div>
            <Header/>
        
        <main className="min-h-dvh grid grid-cols-1 max-h-screen">
            <PageContainer className="z-0 bg-white flex justify-center items-center">
                <section className="w-[1120px] aspect-[5/3] relative z-10 flex flex-col gap-8 justify-center items-center">
                    <article className="relative z-20 h-full w-full bg-transparent p-2 flex flex-col gap-2">
                        <section className="flex justify-center">
                            <WhiteContainer>
                                <span className="text-sm text-zinc font-dogica-bold px-5">
                                    {
                                        genericGameState.message
                                    }
                                </span>
                            </WhiteContainer>
                        </section>
                        <section className="flex">
                            <GameCanvas
                                canvasInitialState={playerPositions}
                                ref={gameCanvasRef}
                                avatarId={avatarId!}
                                diceResult={diceResult}
                            ></GameCanvas>
                            <div className="flex flex-col gap-1">
                                {turnsOrder.map(
                                    (turnPlayer: TurnOrderPlayer) => {
                                        if (
                                            turnPlayer?.playerId ===
                                            localPlayer?.id
                                        ) {
                                            return (
                                                <LocalPlayerCard
                                                    key={turnPlayer.playerId}
                                                    player={
                                                        localPlayerDynamicInfo
                                                    }
                                                />
                                            );
                                        } else {
                                            return (
                                                <PlayerCard
                                                    key={turnPlayer.playerId}
                                                    player={turnPlayer}
                                                />
                                            );
                                        }
                                    }
                                )}
                            </div>
                        </section>

                        <section className="flex flex-col gap-2">
                            <div className="grid grid-cols-4 gap-2">
                                {gameControlButtons.map((button) => (
                                    <WhiteContainer
                                        key={button.control}
                                        onClick={() =>
                                            navigate(`/game/${button.control}`)
                                        }
                                        className="cursor-pointer"
                                    >
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
                                { (is_start_game_stage || is_turn_order_stage) && !turnStage_isTurnOrderStageOver && (
                                    <ActionButtonManager
                                        method={
                                            genericGameState.method as keyof typeof gameStateHandlers
                                        }
                                        wsActionTriggerer={
                                            triggerTurnOrderStage
                                        }
                                        message={
                                            currentPlayerTurnId ===
                                            localPlayer?.id
                                                ? "Lanza los dados"
                                                : "Esperar..."
                                        }
                                        disabled={
                                            currentPlayerTurnId !==
                                            localPlayer?.id
                                        }
                                    />
                                )}

                                {/* ready to start regular turns */}
                                {is_turn_order_stage && turnStage_isTurnOrderStageOver && (
                                    <ActionButtonManager
                                        method="start_new_turn"
                                        wsActionTriggerer={triggerStartNewTurn}
                                        message={
                                            currentPlayerTurnId || turnStage_playerToStartNewTurn  ===
                                            localPlayer?.id
                                                ? "Iniciar nuevo turno"
                                                : "Esperar"
                                        }
                                        disabled={
                                            currentPlayerTurnId || turnStage_playerToStartNewTurn  !==
                                            localPlayer?.id
                                        }
                                    />
                                )}

                                {is_start_new_turn_stage && (
                                        <LocalStateDynamicButton
                                            onClick={triggerAdvanceDaysMessage}
                                            message={
                                                currentPlayerTurnId ===
                                                localPlayer?.id
                                                    ? "Lanzar dados"
                                                    : "Esperar..."
                                            }
                                            disabled={
                                                currentPlayerTurnId !==
                                                localPlayer?.id
                                            }
                                        />
                                    )}

                                {/* {preNewTurnStage_isOver && (
                                    <ActionButtonManager
                                        method="days_advanced"
                                        wsActionTriggerer={triggerAdvanceDaysMessage}
                                        message={
                                            currentPlayerTurnId || turnStage_playerToStartNewTurn  ===
                                            localPlayer?.id
                                                ? "Avanzar dias"
                                                : "Esperar"
                                        }
                                        disabled={
                                            currentPlayerTurnId || turnStage_playerToStartNewTurn  !==
                                            localPlayer?.id
                                        }
                                    />
                                )}

                                

                                {turnStage_isTurnOrderStageOver &&
                                    !preNewTurnStage_isOver &&
                                    newTurnStage_isOver &&
                                    newTurnStage_daysAdvanced && (
                                        <LocalStateDynamicButton
                                            onClick={handleLocallyRolledDices}
                                            message={
                                                currentPlayerTurnId ===
                                                localPlayer?.id
                                                    ? "Lanzar dados"
                                                    : "Esperar"
                                            }
                                            disabled={
                                                currentPlayerTurnId !==
                                                localPlayer?.id
                                            }
                                        />
                                    )} */}
                                
                                {/* { is_notificaation && (
                                        <LocalStateDynamicButton
                                            onClick={() => {}}
                                            message={
                                                "Espera por tu turno..."
                                            }
                                            disabled={true}
                                            darkText={true}
                                            buttonImgSrc="/assets/buttons/ButtonSecondary.png"
                                        />
                                    )} */}

                                {!turnStage_isTurnOrderStageOver &&
                                    turnStage_hasPlayerRolledDices &&
                                    turnStage_dicesResult && (
                                        <div className="border-[3px] border-zinc-900 bg-[#6366F1] flex gap-2 items-center justify-center w-fit min-h-[60px] px-4">
                                            {turnStage_dicesResult.map(
                                                (dice: number) => (
                                                    // <img key={dice} className="text-white font-easvhs text-lg">{dice}</img>
                                                    <img
                                                        key={dice}
                                                        src={`/assets/dices/${dice}.png`}
                                                        alt={`dice${dice}`}
                                                        className="size-[50px] object-contain"
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}

                                {/* preNewTurnStage_isOver &&
                                !newTurnStage_isOver && */}
                                {hasLocalPlayerRolledDicesToAdvanceDays &&
                                    (
                                        <div className="border-[3px] border-zinc-900 bg-[#6366F1] flex gap-2 items-center justify-center w-fit min-h-[60px] px-4">
                                            {newTurn_advancedDays.dices.map(
                                                (dice: number) => (
                                                    // <img key={dice} className="text-white font-easvhs text-lg">{dice}</img>
                                                    <img
                                                        key={dice}
                                                        src={`/assets/dices/${dice}.png`}
                                                        alt={`dice${dice}`}
                                                        className="size-[50px] object-contain"
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}
                                
                                
                            </div>
                        </section>
                    </article>
                    <Outlet></Outlet>
                </section>
            </PageContainer>
        </main>
        </div>
    );
}

interface DicesResult {
    userId: string;
    avatarId: number;
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
        title: "Ver mis Eficiencias",
        description:
            "Habilidades especiales que potencian tu desempeño, aumentando tu capacidad de progreso en el juego.",
        control: "myEfficiencies",
    },
    {
        icon: "/assets/icons/resourcesIcon.png",
        title: "Ver mis Recursos",
        description:
            "Herramienta, tiempo y equipo humano necesarios para ejecutar tus proyectos.",
        control: "myResources",
    },
    {
        icon: "/assets/icons/productsIcon.png",
        title: "Ver mis Productos",
        description:
            "Objetos o mejoras que, una vez adquiridos te ayudarán a ganar más puntos en futuras etapa.",
        control: "myProducts",
    },
    {
        icon: "/assets/icons/projectsIcon.png",
        title: "Ver mis Proyectos",
        description:
            "Misiones o tareas que, al completarse, te otorgan productos.",
        control: "myProjects",
    },
];

interface PlayerCardIcons {
    field: string;
    icon: string;
    tw_bg: string;
    text: string;
}

interface PlayerDataToUseInCard {
    budget: number;
    score: number;
    date: string;
    activeProducts: number;
}

const playerCardIcons = ({
    budget,
    score,
    date,
    activeProducts,
}: PlayerDataToUseInCard): PlayerCardIcons[] => {
    return [
        {
            field: "budget",
            icon: "/assets/icons/cashIcon.png",
            tw_bg: "bg-[#99C579]",
            text: budget.toString(),
        },
        {
            field: "score",
            icon: "/assets/icons/scoreIcon.png",
            tw_bg: "bg-[#e7c710]",
            text: score.toString(),
        },
        {
            field: "date",
            icon: "/assets/icons/dateIcon.png",
            tw_bg: "bg-[#e4675c]",
            text: date,
        },
        {
            field: "activeProducts",
            icon: "/assets/icons/objectCountIcon.png",
            tw_bg: "bg-[#D9D9D9]",
            text: activeProducts.toString(),
        },
    ];
};

// interface UserCardProps {
//     player: TurnOrder;
// }

// export interface CharacterData {
//     id: number;
//     image: string;
//     avatar: string;
//     profession: string;
//     description: string;
//     color: string;
//     twTextColor: string;
// }
function LocalPlayerCard({ player }: { player: LocalPlayerDynamicInfo }) {
    if (!player) return null;
    const characterData =
        charactersData.find(
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
                            {playerCardIcons({
                                budget: player.budget,
                                score: player.score,
                                date: "36",
                                activeProducts: 0,
                            }).map((icon) => (
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
function PlayerCard({ player }: { player: TurnOrderPlayer }) {
    if (!player) return null;
    const characterData =
        charactersData.find(
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
                    <p className="font-easvhs text-lg">{player.name}</p>
                    <div className="grid grid-cols-2 gap-1">
                        {playerCardIcons({
                            budget: 0,
                            score: 0,
                            date: "36",
                            activeProducts: 0,
                        }).map((icon) => {
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

interface DynamicActionButtonProps extends React.HTMLProps<HTMLButtonElement> {
    method: keyof typeof gameStateHandlers;
    wsActionTriggerer: () => void;
    message?: string;
    children?: React.ReactNode;
    buttonImgSrc?: string;
    type?: "submit" | "reset" | "button";
}

function ActionButtonManager(props: DynamicActionButtonProps) {
    const { method, ...rest } = props;
    switch (method) {
        case "start_game":
            return <DynamicActionButton {...rest} name={method} />;
        case "turn_order_stage":
            return <DynamicActionButton {...rest} name={method}/>;
        case "start_new_turn":
                return <DynamicActionButton {...rest} buttonImgSrc="/assets/buttons/Button2.png" name={method}/>;
        case "days_advanced":
                return <DynamicActionButton {...rest} buttonImgSrc="/assets/buttons/Button2.png" name={method}/>;
        default:
            return null;
    }
}

const DynamicActionButton = ({
    wsActionTriggerer,
    message,
    type = "button",
    className,
    children,
    buttonImgSrc="/assets/buttons/ButtonPurple.png",
    ...rest
}: Omit<DynamicActionButtonProps, 'method'>) => {
    return (
        <button {...rest} className={twMerge("relative w-60 aspect-[4/1] aspect flex items-center justify-center", className)} type={type} onClick={wsActionTriggerer}>
            <img
                className="w-full absolute inset-0 h-full"
                src={buttonImgSrc}
                alt="Button"
            />
            <p className="z-10 font-easvhs text-center text-white">
                {message ?? children}
            </p>
        </button>
    );
}

interface LocalStateDynamicButtonProps extends React.HTMLProps<HTMLButtonElement> {
    onClick: () => void;
    message?: string;
    children?: React.ReactNode;
    buttonImgSrc?: string;
    darkText?: boolean;
    type?: "submit" | "reset" | "button";
}

const LocalStateDynamicButton = ({
    onClick,
    message,
    type = "button",
    className,
    children,
    buttonImgSrc="/assets/buttons/ButtonPurple.png",
    darkText=false,
    ...rest
}: LocalStateDynamicButtonProps) => {
    return (
        <button {...rest} className={twMerge("relative w-60 aspect-[4/1] aspect flex items-center justify-center", className)} type={type} onClick={onClick}>
            <img
                className="w-full absolute inset-0 h-full"
                src={buttonImgSrc}
                alt="Button"
            />
            <p className={twMerge("z-10 font-easvhs text-center", darkText ? "text-black" : "text-white")}>
                {message ?? children}
            </p>
        </button>
    );
}


export const diceResult: DicesResult[] = [
    {
        userId: "d25df0df-b0e5-411f-bb70-217a96978a1e",
        avatarId: 2,
        diceNumber: 5,
        result: [1, 1, 1, 1, 1],
        total: 5,
    },

    {
        userId: "a039f866-768c-4134-aa30-02788b696a76",
        avatarId: 1,
        diceNumber: 5,
        result: [6, 1, 1, 1, 1],
        total: 10,
    },
];
