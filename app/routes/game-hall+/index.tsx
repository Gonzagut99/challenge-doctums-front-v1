import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { Button2 } from "~/components/custom/Button2";
import { ButtonSecondary } from "~/components/custom/ButtonSecondary";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";
import { connectedPlayers } from "~/data/connectedPlayers";
import { useRef } from "react";
// import { CharacterData } from '~/types/character';
// import { ConnectedPlayer } from '~/types/connectedPlayer'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const sessionCode = url.searchParams.get("sessionCode");
    console.log(sessionCode)
  
    if(!sessionCode){
      return redirect("/home");
      }
      return json({ sessionCode });
};



function Index() {
    const loaderData = useLoaderData<typeof loader>()
    const currentUserId = connectedPlayers[0].userId;
    const navigate = useNavigate();
    const gameCode = loaderData.sessionCode;
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCopyCode = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                // Usar la API del Portapapeles, solo funciona en localhost y https
                await navigator.clipboard.writeText(gameCode);
              }else{
                // Usar el input cuando es http
                inputRef.current?.select();
                document.execCommand('copy');
                inputRef.current?.blur();
              }
            // await navigator.clipboard.writeText(gameCode);
            // // Opcional: Mostrar un toast o feedback
            // console.log('Código copiado al portapapeles');
            toast.success('Código copiado al portapapeles');
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    return (
        <article className="h-full w-full relative z-10 py-4 px-8 flex flex-col gap-6">
            <section>
                <header className="flex justify-center relative">
                    <button
                        className="absolute left-0"
                        onClick={() => navigate(-1)}
                    >
                        <img
                            src="/assets/buttons/BackButton.png"
                            alt="Back Button"
                            className="size-16"
                        />
                    </button>
                    <h1 className="font-dogica-bold text-zinc-900 text-balance text-2xl text-center px-4 py-2 bg-white/90 w-fit rounded-md border-zinc-900 border-[4px] shadow-lg">
                        ESPERANDO JUGADORES ...
                    </h1>
                </header>
            </section>
            <section className="grow flex justify-center items-end gap-3">
            {
                connectedPlayers.map((player) => {
                    const nameTooltipDefaultClassname = "font-easvhs text-xl text-zinc-900 bg-zinc-50 border-[3px] border-zinc-900 rounded-md px-2 py-1"
                    const nameTooltipClassname = twMerge(nameTooltipDefaultClassname, player.characterData.twTextColor)
                    if (player.userId === currentUserId) {
                        return (
                            <div key={player.userId} className="flex items-center flex-col">
                                <div className={nameTooltipClassname}>
                                    Tú
                                </div>
                                <img src={player.characterData.avatar} alt={player.characterData.profession} className="w-16 h-28 object-cover" />
                            </div>
                        )
                    }
                    return (
                        <div key={player.userId} className="flex items-center flex-col ">
                        <div className={nameTooltipClassname}>
                            {player.name}
                        </div>
                        <img src={player.characterData.avatar} alt={player.characterData.profession} className="w-16 h-28 object-cover" />
                    </div>
                    )
                })
            }
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

                <Button2 className="w-48" onClick={()=>navigate('/home')}>
                    <span className="text-white font-easvhs text-xl" >
                        Iniciar partida
                    </span>
                </Button2>
            </section>
        </article>
    );
}

export default Index;
