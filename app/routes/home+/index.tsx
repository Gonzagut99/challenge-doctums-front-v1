import { json, Link, useActionData, useFetcher } from "@remix-run/react";
import { Button } from "~/components/custom/Button";
import { gameSessionService } from "~/services/http/GameSessionServices";
import { useGameStore } from "~/store/useGameStore";

export const action = async () => {
    const response = await gameSessionService.createGameSession();
    // const gameSession = response?.data
    return json(response)
};

function Index() {
    const updateGameSessionState = useGameStore((state)=> state.startGameSession)    
    const actionData = useActionData<typeof action>()
    let error
    let gameSession
    if (actionData && 'error' in actionData){
        error = actionData
    }
    if (actionData && !error) gameSession = actionData?.data
    if (gameSession) updateGameSessionState(gameSession)

        
    const fetcher = useFetcher();
    const handleSubmit = ()=>{
        fetcher.submit(
            {
                action: "/home",
                method: "post",
                encType: "application/x-www-form-urlencoded",
                preventScrollReset: false,
                replace: true,
            }
        );
    }
    return (
        <>
            <header className="px-4 py-2 backdrop-blur-lg w-2/3 rounded-sm">
                <h1 className="text-yellow-50 text-2xl font-bold text-center text-balance font-dogica-bold shadow-slate-700 text-shadow-lg">
                    Bienvenido al challenge Doctums
                </h1>
            </header>
            <div className="flex flex-col gap-4">
                <Button onClick={handleSubmit}>
                    <span className="z-10  text-white font-easvhs text-2xl">
                        Crear partida
                    </span>
                </Button>
                <Link to={"/home/joinGame"}>
                    <Button>
                        <span className="z-10 text-white font-easvhs text-2xl">
                            Unirse a partida
                        </span>
                    </Button>
                </Link>
            </div>
        </>
    );
}

export default Index;
