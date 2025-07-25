/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { useEffect, useRef } from "react";
import { json, redirect, replace, useNavigate, useSubmit } from "@remix-run/react";
import { Button2 } from "~/components/custom/Button2";
import { ButtonSecondary } from "~/components/custom/ButtonSecondary";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";
import { charactersData } from "~/data/characters";
import {  getWebSocketService, instancesManager } from "~/services/ws";
import { useLiveLoader } from "~/utils/use-live-loader";
import MusicAndSoundControls from "~/components/custom/music/ControlMusic";
import { useSoundContext } from "~/components/custom/music/SoundContext";
import { Header } from "~/components/custom/landing/Header";
import { PageContainer } from "~/components/custom/PageContainer";
import { Outlet, useLocation } from "@remix-run/react";
// import { CharacterData } from '~/types/character';
// import { ConnectedPlayer } from '~/types/connectedPlayer'



export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const sessionCode = url.searchParams.get("sessionCode") as string;
    const playerId = url.searchParams.get("playerId") as string;
    const instance = getWebSocketService(sessionCode, playerId);
    const connectedPlayers = instance?.getConnectedPlayers() ?? [];
    const player = instance?.getLocalPlayerAvatarInfo();
    const isGameStarted = instance?.isGameStarted();

    if (!sessionCode) {
        return redirect("/home");
    }

    if(isGameStarted){
        return redirect(`/game?sessionCode=${sessionCode}&playerId=${playerId}`);
    }
    return json({ sessionCode, player, connectedPlayers });
};


export const action = async({request}: ActionFunctionArgs) => {
    const url = new URL(request.url);
    const sessionCode = url.searchParams.get("sessionCode") as string;
    const playerId = url.searchParams.get("playerId") as string;
    const instance = getWebSocketService(sessionCode, playerId);
    instance?.startGame();
    return replace(`/game?sessionCode=${sessionCode}&playerId=${playerId}`);
}

function Index() {
    const loaderData = useLiveLoader<typeof loader>();
    const connectedPlayers = loaderData.connectedPlayers;
    const currentUserId = loaderData.player?.id;
    const gameCode = loaderData.sessionCode;
    const location = useLocation();
    
    // Check if we're on the stream route
    const isStreamRoute = location.pathname.includes('/stream');
    // const currentUserId = loaderData.player.id;
    // const connectedPlayers = loaderData.connectedPlayers;

    const navigate = useNavigate();
    const submit = useSubmit();
    const inputRef = useRef<HTMLInputElement>(null);

    const { isSoundOn } = useSoundContext(); // Control global del sonido
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const previousPlayersCount = useRef(connectedPlayers.length);

    useEffect(() => {
        // Reproduce el sonido cuando se detecta un nuevo jugador
        if (connectedPlayers.length > previousPlayersCount.current) {
            if (!audioRef.current) {
                audioRef.current = new Audio("/assets/audios/sound-effects/new-character.mp3");
            }
            if (isSoundOn) {
                console.log("[PlayersSection]: Nuevo personaje añadido, reproduciendo sonido.");
                audioRef.current.currentTime = 0; // Reinicia el sonido
                audioRef.current.play().catch((err) =>
                    console.error("Error al reproducir el sonido de notificación:", err)
                );
            } else {
                console.log("[PlayersSection]: Sonido desactivado globalmente.");
            }
        }
        previousPlayersCount.current = connectedPlayers.length; // Actualiza el conteo
    }, [connectedPlayers, isSoundOn]); // Escucha cambios en connectedPlayers e isSoundOn

    console.log(currentUserId)
    const isHost = connectedPlayers.find(
        (player) => player.id === currentUserId
    )?.isHost;

    

    const handleCopyCode = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                // Usar la API del Portapapeles, solo funciona en localhost y https
                await navigator.clipboard.writeText(gameCode);
            } else {
                // Usar el input cuando es http
                inputRef.current?.select();
                document.execCommand("copy");
                inputRef.current?.blur();
            }
            // await navigator.clipboard.writeText(gameCode);
            // // Opcional: Mostrar un toast o feedback
            // console.log('Código copiado al portapapeles');
            toast.success("Código copiado al portapapeles");
        } catch (err) {
            console.error("Error al copiar:", err);
        }
    };

    // If we're on the stream route, render the nested route content
    if (isStreamRoute) {
        return <Outlet />;
    }

    // Otherwise, render the game hall content
    return (
        <div
            className="min-h-dvh grid grid-cols-1 h-full"
            style={{
                backgroundImage: 'url(/assets/landing/img/gradiente.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <Header />
            <main className="min-h-dvh grid grid-cols-1">
                <PageContainer className="z-0 bg-transparent flex justify-center items-center">
                    <section className="w-[950px] aspect-[3/2] relative flex flex-col gap-8 justify-center items-center">
                        <img
                            className="-z-10 aspect-[3/2] object-fill absolute inset-0"
                            src="/assets/backgrounds/waitingHallBg.png"
                            alt="Landing Background"
                        />
        <article className="h-full w-full relative z-10 py-4 px-8 flex flex-col gap-6">
            <div className="absolute top-0 right-2">
            <MusicAndSoundControls />
        </div>
            <section>
                <header className="flex justify-center relative">
                    {/* <button
                        className="absolute left-0"
                        onClick={() => navigate(-1)}
                    >
                        <img
                            src="/assets/buttons/BackButton.png"
                            alt="Back Button"
                            className="size-16"
                        />
                    </button> */}
                    <h1 className="font-easvhs font-bold tracking-[0.1em] text-zinc-900 text-balance text-2xl text-center px-4 py-2 bg-white/90 w-fit rounded-md border-zinc-900 border-[4px] shadow-lg">
                        ESPERANDO JUGADORES ...
                    </h1>
                </header>
            </section>
            <section className="grow flex justify-center items-end gap-3">
                {connectedPlayers.map((player) => {
                    const characterData =
                        charactersData.find(
                            (character) =>
                                character.id == parseInt(player.avatarId)
                        ) ?? charactersData[0];

                    const nameTooltipDefaultClassname =
                        "font-easvhs text-xl text-zinc-900 bg-zinc-50 border-[3px] border-zinc-900 rounded-md px-2 py-1";
                    const nameTooltipClassname = twMerge(
                        nameTooltipDefaultClassname,
                        characterData.twTextColor
                    );
                    if (player.id === currentUserId) {
                        return (
                            <div
                                key={player.id}
                                className="flex items-center flex-col"
                            >
                                <div className={nameTooltipClassname}>Tú</div>
                                <img
                                    src={characterData.avatar}
                                    alt={characterData.profession}
                                    className="w-16 h-28 object-cover"
                                />
                            </div>
                        );
                    }
                    return (
                        <div
                            key={player.id}
                            className="flex items-center flex-col "
                        >
                            <div className={nameTooltipClassname}>
                                {player.name}
                            </div>
                            <img
                                src={characterData.avatar}
                                alt={characterData.profession}
                                className="w-16 h-28 object-cover"
                            />
                        </div>
                    );
                })}
            </section>
            <section className="flex justify-center gap-4">
                <ButtonSecondary className="w-48" onClick={handleCopyCode}>
                    <span className="text-zinc-900 font-easvhs text-xl">
                        Copiar código
                    </span>
                </ButtonSecondary>

                <section className="relative">
                    <img
                        src="/assets/components/input.png"
                        alt="input"
                        className="absolute inset-0 w-64 h-[4rem]"
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={gameCode}
                        readOnly
                        className="bg-transparent relative font-easvhs text-center w-64 h-[4rem] px-4 text-xl border-none active:border-none ring-0 focus:ring-0 active:ring-0 outline-none focus:outline-none"
                    />
                </section>

                {isHost && (
                    <Button2 className="w-48 disabled:opacity-50" disabled={connectedPlayers.length < 2}
                     onClick={
                        (e) => {
                            e.preventDefault();
                            submit(
                                {},
                                {
                                    method: "POST",
                
                                    
                                }
                            );
                        }
                     }>
                        <span className="text-white font-easvhs text-xl">
                            Iniciar partida
                        </span>
                    </Button2>
                    // <Form method="post" action="/game-hall/index">
                        
                    // </Form>
                )}
            </section>
        </article>
                    </section>
                </PageContainer>
            </main>
        </div>
    );
}

export default Index;
