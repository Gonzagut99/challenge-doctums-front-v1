import { json, Link, useActionData, useFetcher, useNavigate } from "@remix-run/react";
import { Button } from "~/components/custom/Button";
import { gameSessionService } from "~/services/http/GameSessionServices";
import { useGameStore } from "~/store/useGameStore";

export const action = async () => {
    const response = await gameSessionService.createGameSession();
    console.log(response)
    console.log(response?.data)
    console.log(json(JSON.stringify(response)))
    // const gameSession = response?.data
    return json(response)
};

function Index() {
    const updateGameSessionState = useGameStore((state)=> state.startGameSession)    
    const actionData = useActionData<typeof action>()
    const navigate = useNavigate()
    let error
    let gameSession
    if (actionData && 'error' in actionData){
        error = actionData
    }
    if (actionData && !error) gameSession = actionData?.data
    if (gameSession) {
        console.log(gameSession)
        updateGameSessionState(gameSession)
        navigate(`/home/chooseCharacter`,{
            replace: true
        })
    }

        
    const fetcher = useFetcher();
    const handleSubmit = ()=>{
        fetcher.submit(
            {},
            {
                method: "POST",
                encType: "application/x-www-form-urlencoded",
                preventScrollReset: false,
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
