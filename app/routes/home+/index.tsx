import { Link } from "@remix-run/react";
import { Button } from "~/components/custom/Button";

function index() {
    return (
        <>
            <header className="px-4 py-2 backdrop-blur-lg w-2/3 rounded-sm">
                <h1 className="text-yellow-50 text-2xl font-bold text-center text-balance font-dogica-bold shadow-slate-700 text-shadow-lg">
                    Bienvenido al challenge Doctums
                </h1>
            </header>
            <div className="flex flex-col gap-4">
                <Link to={"/newGameSession"}>
                    <Button>
                        <span className="z-10  text-white font-easvhs text-2xl">
                            Crear partida
                        </span>
                    </Button>
                </Link>
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

export default index;
