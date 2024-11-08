import { Link } from "@remix-run/react";
import { Button } from "~/components/custom/Button";
import { PageContainer } from "~/components/custom/PageContainer";

function index() {
    return (
        <PageContainer className="z-0 bg-gradient-to-r from-sky-500 to-indigo-500 flex justify-center items-center">
            {/* <img className='absolute inset-0 aspect-video max-w-screen-sm object-contain' src="/assets/backgrounds/LandingBackground.png" alt="Landing Background" /> */}
            {/* <figure className=''>
        </figure> */}
            <section className="w-[950px] aspect-[3/2] relative flex flex-col gap-8 justify-center items-center">
                <img
                    className="-z-10 aspect-[3/2] object-cover absolute inset-0"
                    src="/assets/backgrounds/LandingBackground.png"
                    alt="Landing Background"
                />
                {/* <figure className='absolute w-[1000px] aspect-video'>
            </figure> */}
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
                    <Link to={"/joinGameSession"}>
                        <Button>
                            <span className="z-10 text-white font-easvhs text-2xl">
                                Unirse a partida
                            </span>
                        </Button>
                    </Link>
                </div>
                {/* <p className="font-sans">Hola</p> */}
            </section>
        </PageContainer>
    );
}

export default index;
