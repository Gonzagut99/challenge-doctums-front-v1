import { Form, json,  useLoaderData, useNavigation} from "@remix-run/react";
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
import { useEffect } from "react";
import { globalWebSocketService } from "~/services/ws";

//Form validation and configuration
const schema = z.object({
    playerName: z.string().min(3, "El nombre debe tener al menos 3 caractéres"),
    characterId: z.number().max(4).int("El id del personaje debe ser un número entero"),
    sessionCode: z.string().min(36, "El codigo debe tener 36 caractéres").max(36).uuid("No es un código válido")
});

type FormData = z.infer<typeof schema>;
const resolver = zodResolver(schema);

export const loader = ( { request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const sessionCode = url.searchParams.get("sessionCode");

  if(!sessionCode){
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
    
    if(createdPlayer.data == undefined){
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

    const form = useRemixForm<FormData>({
        mode: "onSubmit",
        resolver,
        defaultValues:{
            sessionCode: loaderData.sessionCode
        }
    });

    const handleSelectCharacter = (characterId:number) => {
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
    

    return (
        <article className="h-full w-full backdrop-blur-[2px] bg-white/70 relative z-10 py-4 px-8 flex flex-col gap-6"
        
        >
            <section>
                <header className="flex justify-center relative">
                    <img
                        src="/assets/buttons/BackButton.png"
                        alt="Back Button"
                        className="absolute left-0 size-16"
                    />
                    <h1 className="font-dogica-bold text-zinc-900 text-balance text-3xl text-center px-4 py-2 bg-white/80 w-fit rounded-md border-zinc-900 border-[4px] shadow-lg">
                        ESCOGE TU PERSONAJE
                    </h1>
                </header>
            </section>
            <section>
                <RemixFormProvider {...form}>
                    <Form className="flex flex-col gap-3 items-center" method="post" action="/home/chooseCharacter" onSubmit={handleSubmit}>
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
                                    className="bg-transparent relative font-easvhs text-center w-80 h-[3.5rem] px-4 text-xl border-none active:border-none ring-0 focus:ring-0 active:ring-0 outline-none focus:outline-none"
                                />
                                {errors.playerName && (
                                    <p className="text-red-500 text-base font-easvhs">
                                        {errors.playerName.message}
                                    </p>
                                )}
                            </div>
                        </div>                       
                        <div className="grid grid-cols-4 grid-rows-1 gap-3">
                            {
                                charactersData.map((character) => (
                                    <CharacterCard
                                        key={character.id}
                                        characterData={character}
                                        onClick={() => handleSelectCharacter(character.id)}
                                    />
                                ))
                            }
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
                            <Button2 type="submit" className="font-easvhs text-2xl text-white" disabled = {navigation.state != "idle"}>
                                {
                                    navigation.state == "idle" ? "Continuar" : "Ingresando a sala de espera..."
                                }
                            </Button2>
                        </div>
                    </Form>
                </RemixFormProvider>
            </section>
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
        description,
        color,
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
            <div className="flex flex-col h-full">
                <figure className={twMerge("h-44 flex justify-center border-zinc-900 border-[3px] rounded-sm px-2", color)}>
                <img
                    src={image}
                    alt={profession}
                    className="object-contain"
                />
                </figure>
                <div className="p-1 border-zinc-900 border-[3px] rounded-sm bg-white border-t-0 h-full">
                <p className="font-rajdhani font-semibold text-[12px] text-pretty">
                    {description}
                </p>
                </div>
            </div>
        </button>
    );
};

export default ChooseCharacter;
