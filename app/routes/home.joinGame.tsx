import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Button2 } from "~/components/custom/Button2";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    getValidatedFormData,
    RemixFormProvider,
    useRemixForm,
} from "remix-hook-form";
import { Form } from "@remix-run/react";
import { Header } from "~/components/custom/landing/Header";
import { PageContainer } from "~/components/custom/PageContainer";
//import { initializeWebSocket } from "~/services/ws";

const schema = z.object({
    sessionCode: z.string().min(36, "El código debe tener al menos 36 caractéres").max(36).uuid("No es un código válido"),
});

type FormData = z.infer<typeof schema>;
const resolver = zodResolver(schema);

export const action = async ({ request }: ActionFunctionArgs) => {
    const { data, errors, receivedValues } =
        await getValidatedFormData<FormData>(request, resolver);

    if (errors) {
        return json({ errors, receivedValues }, { status: 400 });
    }

    const { sessionCode } = data;

    if (!sessionCode) {
        return json(
            { errors: { sessionCode: "Código de sesión no válido" } },
            { status: 400 }
        );
    }

    //if (sessionCode) return redirect(`/home/chooseCharacter?sessionCode=${sessionCode}`);

    //globalWebSocketService.setGameId(sessionCode);
    //globalWebSocketService.connect();
    //initializeWebSocket(sessionCode);
    return redirect(`/home/chooseCharacter?sessionCode=${sessionCode}`);
};

function JoinGame() {
    const form = useRemixForm<FormData>({
        mode: "onSubmit",
        resolver,
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = form;

    return (
        <div
            className="min-h-dvh grid grid-cols-1 relative"
            style={{
                backgroundImage: 'url(/assets/landing/img/gradiente.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <Header />
            <main className="flex justify-center items-center">
                <PageContainer className="z-0 bg-white flex justify-center items-center">
                    <section className="w-[950px] aspect-[3/2] relative flex flex-col gap-8 items-center">
                        <img
                            className="-z-10 aspect-[3/2] object-cover absolute inset-0"
                            src="/assets/backgrounds/LandingBackground.png"
                            alt="Landing Background"
                        />
                        <div className="absolute h-96 inset-0 bg-gradient-to-b from-black/75 via-purple-transparent to-transparent -z-10"></div>
                        
        <article className="h-full w-full backdrop-blur-[2px] bg-white/70 relative z-10">
            <section className="z-20 absolute w-full h-full flex justify-center items-center px-64 pt-[4.2rem] pb-[9rem]">
                <div className="h-full w-full flex flex-col justify-center items-center px-6 gap-4">
                    <header className="font-easvhs font-bold tracking-[0.1em] text-zinc-900 text-balance text-3xl text-center">
                        INTRODUCE EL CÓDIGO
                    </header>
                    <p className="font-rajdhani leading-snug font-semibold text-2xl text-center">
                        Si tienes algún código de partida, introdúcelo aquí
                    </p>
                    <div className="flex flex-col gap-3">
                        <RemixFormProvider {...form}>
                            <Form
                                onSubmit={handleSubmit}
                                className="relative"
                                method="post"
                                action="/home/joinGame"
                            >
                                <img
                                    src="/assets/components/input.png"
                                    alt="input"
                                    className="absolute inset-0 "
                                />
                                <input
                                    {...register("sessionCode")}
                                    type="text"
                                    placeholder="Ingresar código"
                                    className="bg-transparent relative font-easvhs text-center w-80 h-[5.1rem] px-4 text-xl border-none active:border-none ring-0 focus:ring-0 active:ring-0 outline-none focus:outline-none"
                                />
                                {errors.sessionCode && (
                                    <p className="text-red-500 text-base font-easvhs">
                                        {errors.sessionCode.message}
                                    </p>
                                )}
                                <Button2 className="w-full" type="submit">
                                    <span className="text-white font-easvhs text-2xl">
                                        Unirse a partida
                                    </span>
                                </Button2>
                            </Form>
                        </RemixFormProvider>
                    </div>
                </div>
            </section>
            <img
                src="/assets/frames/tablet.png"
                alt="tablet"
                className="absolute object-cover aspect-[3/2] -left-4"
            />
        </article>
                    </section>
                </PageContainer>
            </main>
        </div>
    );
}

export default JoinGame;
