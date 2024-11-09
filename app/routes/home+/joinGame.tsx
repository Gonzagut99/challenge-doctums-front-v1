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

    if (sessionCode) return redirect(`/game/${sessionCode}`);
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
        <article className="h-full w-full backdrop-blur-[2px] bg-white/70 relative z-10">
            <section className="z-20 absolute w-full h-full flex justify-center items-center px-64 pt-[4.2rem] pb-[9rem]">
                <div className="h-full w-full flex flex-col justify-center items-center px-6 gap-4">
                    <header className="font-dogica-bold text-zinc-900 text-balance text-3xl text-center">
                        Introduce el código
                    </header>
                    <p className="font-easvhs text-xl text-center">
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
    );
}

export default JoinGame;
