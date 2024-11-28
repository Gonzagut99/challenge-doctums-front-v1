import { json, Link, useFetcher, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import MusicAndSoundControls from "~/components/custom/music/ControlMusic";
import { Button } from "~/components/custom/Button";
import { gameSessionService } from "~/services/http/GameSessionServices";
import { initializeWebSocket } from "~/services/ws";
// import { useGameStore } from "~/store/useGameStore";

export const action = async () => {
    const response = await gameSessionService.createGameSession();
    const gameSession = response?.data
    if(gameSession){
        initializeWebSocket(gameSession.id);
    }
    // if (!response) {
    //     return json({ error: "No se pudo crear la sesión de juego" }, { status: 500 });
    // }
    // console.log(response);
    // console.log(response?.data);
    // console.log(json(JSON.stringify(response)));
    // const gameSession = response?.data
    return json(response);
};

function Index() {
    // const {startGameSession,initializeWebSocket } = useGameStore();
    // const updateGameSessionState = useGameStore(
    //     (state) => state.startGameSession
    // );
    // const gameSessionId = useGameStore((state) => state.gameSession?.id);
    // // const initilizeWebSocket = useGameStore(
    // //     (state) => state.initializeWebSocket
    // // );
    // const webSocketService = useGameStore((state) => state.webSocketService);
    const navigate = useNavigate();
    const fetcher = useFetcher<typeof action>();
    const [showStaticImage, setShowStaticImage] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
          setShowStaticImage(true);
        }, 3000); 
    
        return () => clearTimeout(timer);
      }, []);

   
    useEffect(() => {

        if (fetcher.data) {
            const error = fetcher.data?.error;
            const gameSession = fetcher.data?.data;
            // if(gameSession) {
            //     globalWebSocketService.setGameId(gameSession.id);
            //     globalWebSocketService.connect();
            // }
            // if (gameSession) {
            //     startGameSession(gameSession);
            //     initializeWebSocket(gameSession?.id)
            //     // console.log("gameSession", gameSessionId);

            //     // if (webSocketService) console.log("webSocketService", true);
            // }

            if (error) {
                console.error("Error:", error);
                // Manejar errores aquí (mostrar mensaje al usuario, etc.)
            } else if (gameSession) {
                console.log("Sesión de juego:", gameSession);
                //startGameSession(gameSession);
                navigate(`/home/chooseCharacter?sessionCode=${gameSession.id}`, { replace: true });
            }
        }
    }, [fetcher.data, navigate,]);

    const handleSubmit = () => {
        fetcher.submit(
            {},
            {
                method: "POST",
                encType: "application/x-www-form-urlencoded",
                preventScrollReset: false,
            }
        );
    };
    return (
        <>
        <div className="absolute top-0 right-2">
            <MusicAndSoundControls />
        </div>
        <div className="flex flex-col h-full items-center w-full justify-center gap-10">
                {/* <header className="px-4 py-2 backdrop-blur-lg w-2/3 rounded-sm">
        <h1 className="text-yellow-50 text-2xl font-bold text-center text-balance font-dogica-bold shadow-slate-700 text-shadow-lg">
            Bienvenido al challenge Doctums
        </h1>
    </header> */}
                <header className="flex items-center justify-center w-full">
                    {showStaticImage ? (
                        // Mostrar la imagen estática después de la animación
                        <img src="/assets/challenge-logo.png" alt="Logo estático" className="w-1/2" />
                    ) : (
                        // Mostrar el GIF o animación inicialmente
                        <img src="/assets/challenge-animation.gif" alt="Animación inicial" className="w-1/2" />
                    )}
                </header>
                <div className="flex flex-col gap-4 justify-center items-center">
                    <Button onClick={handleSubmit} hoverImgSrc="/assets/buttons/Button-hover.png" disabled={fetcher.state != 'idle'}>
                        <span className="z-10  text-white font-easvhs text-2xl group-hover:opacity-90">
                            {fetcher.state === "submitting" || fetcher.state === "loading" ? "Creando partida..." : "Crear partida"}
                        </span>
                    </Button>
                    <Link to={"/home/joinGame"}>
                        <Button hoverImgSrc="/assets/buttons/Button-hover.png">
                            <span className="z-10 text-white font-easvhs text-2xl group-hover:opacity-90">
                                Unirse a partida
                            </span>
                        </Button>
                    </Link>
                </div>
            </div></>
    );
}

export default Index;
