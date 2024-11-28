import { Form, json, useLoaderData, useNavigation } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import { Button2 } from "~/components/custom/Button2";
import { charactersData } from "~/data/characters";
import { createPlayer } from "~/services/http/player";
import { CharacterData } from '~/types/character';
import { z } from "zod";
import { redirect, replace, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    getValidatedFormData,
    RemixFormProvider,
    useRemixForm,
} from "remix-hook-form";
import { useEffect, useState } from "react";
import { globalWebSocketService } from "~/services/ws";
import MusicAndSoundControls from "~/components/custom/music/ControlMusic";

//Form validation and configuration
const schema = z.object({
    playerName: z.string().min(3, "El nombre debe tener al menos 3 caractéres"),
    characterId: z.number({
        required_error: "Debes seleccionar un personaje"
    }).max(6).int("El id del personaje debe ser un número entero"),
    sessionCode: z.string().min(36, "El codigo debe tener 36 caractéres").max(36).uuid("No es un código válido")
});

type FormData = z.infer<typeof schema>;
const resolver = zodResolver(schema);

export const loader = ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const sessionCode = url.searchParams.get("sessionCode");

    if (!sessionCode) {
        return redirect("/home");
    }
    return json({ sessionCode });
};

export const action = async ({ request }: ActionFunctionArgs) => {

    const { data, errors, receivedValues } =
        await getValidatedFormData<FormData>(request, resolver);

    if (errors) {
        return json({ errors, receivedValues }, { status: 400 });
    }

    const createdPlayer = await createPlayer({ name: data.playerName, game_session_id: data.sessionCode, avatar_id: data.characterId.toString() });

    if (createdPlayer.data == undefined) {
        return json({ error: "No se pudo crear el jugador" }, { status: 500 });
    }

    globalWebSocketService.setPlayer(createdPlayer.data);
    globalWebSocketService.joinGame();
    return replace(`/game-hall?sessionCode=${data.sessionCode}`);
};

function ChooseCharacter() {
    const loaderData = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    // const submit = useSubmit();
    const [currentIndex, setCurrentIndex] = useState(0);

    const form = useRemixForm<FormData>({
        mode: "onSubmit",
        resolver,
        defaultValues: {
            sessionCode: loaderData.sessionCode
        }
    });

    const handleSelectCharacter = (characterId: number) => {
        form.setValue('characterId', characterId)
    }


    const {
        handleSubmit,
        register,
        formState: { errors },
        watch,
    } = form;

    // const clickSubmitEvent = async () => {

    //     if (validated) {
    //         submit(form.getValues(), {
    //             action: '/home/chooseCharacter',
    //             method: 'post',
    //         });
    //     }
    // }
    useEffect(() => {
        console.log('Watch values:', {
            playerName: watch('playerName'),
            characterId: watch('characterId'),
            sessionCode: watch('sessionCode')
        });
    }, [watch]);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? charactersData.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === charactersData.length - 1 ? 0 : prevIndex + 1
        );
    };


    return (
        <article className="h-full w-full backdrop-blur-[2px] bg-white/70 relative z-10 py-4 px-8 flex flex-col gap-6"

        >
             <div className="absolute top-0 right-2">
            <MusicAndSoundControls />
        </div>
            <section>
                <header className="flex justify-center relative">
                    <img
                        src="/assets/buttons/BackButton.png"
                        alt="Back Button"
                        className="absolute left-0 size-16"
                    />
                    <h1 className="font-easvhs font-bold tracking-[0.1em] text-zinc-900 text-balance text-2xl text-center px-4 py-2 bg-white/80 w-fit rounded-md border-zinc-900 border-[4px] shadow-lg">
                        ESCOGE TU PERSONAJE
                    </h1>
                </header>
            </section>
            {/* Botón Anterior */}
            <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
            >
                &#8249;
            </button>
            <section>
                <RemixFormProvider {...form}>
                    <Form className="flex flex-col items-center" method="post" action="/home/chooseCharacter" onSubmit={handleSubmit}>
                        <div className="flex gap-2 items-center justify-center">
                            <label htmlFor="name" className="text-2xl font-easvhs">
                                Ingresa tu nombre:
                            </label>
                            <div className="relative w-fit">
                                <img
                                    src="/assets/components/input.png"
                                    alt="input"
                                    className="absolute inset-0 w-full object-fill h-[3.5rem]"
                                />
                                <input
                                    {...register("playerName")}
                                    type="text"
                                    id="name"
                                    name="playerName"
                                    className="bg-transparent relative font-easvhs text-center w-80 h-[3.5rem] px-4 text-xl border-none active:border-none ring-0 focus:ring-0 active:ring-0 outline-none focus:outline-none focus:bg-transparent autofill:!bg-transparent selection:bg-transparent"
                                />
                                {errors.playerName && (
                                    <p className="text-red-500 text-base font-easvhs">
                                        {errors.playerName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="w-full max-w-[90%] h-auto relative overflow-hidden">
                            
                            <div
                                className="flex items-center h-[24rem] transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(-${(currentIndex % charactersData.length) * (100 / 6)}%)`,
                                    width: `${(charactersData.length + 6) * (100 / 4)}%`,
                                }}
                            >
                                {charactersData.concat(charactersData).map((character, index) => (
                                    <div
                                        key={index}
                                        className="flex shrink-0   justify-center h-[22rem] px-1 "
                                    >
                                        <CharacterCard
                                            characterData={character}
                                            onClick={() => handleSelectCharacter(character.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            {
                                errors.root && (
                                    <p className="text-red-500 text-base font-easvhs">
                                        {errors.root.message}
                                    </p>
                                )
                            }
                            {
                                errors.characterId && (
                                    <p className="text-red-500 text-base font-easvhs">
                                        {errors.characterId.message}
                                    </p>
                                )
                            }
                        </div>
                        <div className="flex justify-center">
                            <Button2 type="submit" className="font-easvhs text-2xl text-white" disabled={navigation.state != "idle"}>
                                {
                                    navigation.state == "idle" ? "Continuar" : "Ingresando a sala de espera..."
                                }
                            </Button2>
                        </div>
                    </Form>
                </RemixFormProvider>
            </section>

            {/* Botón Siguiente */}
            <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
            >
                &#8250;
            </button>
        </article>
    );
}

//extends React.HTMLProps<HTMLDivElement>
interface CharacterCardProps extends React.HTMLProps<HTMLButtonElement> {
    characterData: CharacterData;
}

export const CharacterCard = ({
    characterData,
    ...rest
}: CharacterCardProps) => {
    const {
        image,
        profession,
        //description,
        color,
        preview,
        id
    } = characterData;

    return (
        <button
            {...rest}
            className="w-[12rem] flex flex-col gap-2 hover:scale-105 transform transition-transform duration-300 focus:outline-dotted focus:outline-[3px] focus:outline-zinc-900"
            id={id.toString()}
            type="button"
        >
            <header className="px-4 py-1 w-full border-zinc-900 border-[3px] rounded-sm bg-white">
                <h3 className="font-easvhs text-base text-center">
                    {profession.toUpperCase()}
                </h3>
            </header>
            <div className="flex flex-col h-full w-full">
                <figure className={twMerge("h-44 flex justify-center border-zinc-900 border-[3px] rounded-sm px-2", color)}>
                    <img
                        src={image}
                        alt={profession}
                        className="object-contain"
                    />
                </figure>
                <div className="p-1 border-zinc-900 border-[3px] rounded-sm bg-white border-t-0 h-full">
                    <ul className="font-rajdhani font-semibold text-[12px] text-pretty flex flex-col gap-1">
                        {
                            Object.entries(preview).map(([key, value]) => {
                                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, (str) => str.toUpperCase());
                                return (
                                    <li key={key} className="flex flex-col">
                                        <span className="font-bold text-sm">{formattedKey}: </span>
                                        <ul className="text-sm leading-tight">
                                            {
                                                value.map((item) => (
                                                    <li key={item} className="flex items-center space-x-1 w-full justify-center">
                                                        <img src="/assets/icons/check.png" alt="Check" className="object-contain aspect-square max-w-3 " />
                                                        <span>
                                                            {item}
                                                        </span>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </button>
    );
};

// {
//     id: 3,
//     image: "/assets/characters/characterMale2.png",
//     avatar: "/assets/characters/avatars/AvatarMale2.png",
//     profession: "Ing. de Software",
//     description:
//         "Ideal para proyectos que requieren soluciones técnicas avanzadas. En cuanto a habilidades blandas, es creativo y resiliente, capaz de adaptarse rápidamentea los cambios y aportar nuevas ideas en cada fase del proyecto.",
//     preview: { habilidadesTecnicas: [ "Soluciones técnicas avanzadas" ], habilidadesBlandas: [ "Creatividad", "Resiliencia" ], adaptabilidad: [ "Adaptación a cambios", "Aportar nuevas ideas" ] },
//     color: "bg-[#29AA5B]",
//     twTextColor: "text-[#29AA5B]",
// }



export default ChooseCharacter;
