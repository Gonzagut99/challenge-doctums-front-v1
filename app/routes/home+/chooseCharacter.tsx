// import { Form, json,useActionData,  useLoaderData} from "@remix-run/react";
// import { twMerge } from "tailwind-merge";
// import { Button2 } from "~/components/custom/Button2";
// import { charactersData } from "~/data/characters";
// import { createPlayer } from "~/services/http/player";
// import { CharacterData } from '~/types/character';
// import { z } from "zod";
// import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//     getValidatedFormData,
//     RemixFormProvider,
//     useRemixForm,
// } from "remix-hook-form";
// import { useState } from "react";

// //Form validation and configuration
// const schema = z.object({
//     playerName: z.string().min(36, "El código debe tener al menos 36 caractéres").max(36).uuid("No es un código válido"),
//     characterId: z.string().min(1).max(1),
//     gameSession: z.string().min(36).max(36).uuid("No es un código válido")
// });

// type FormData = z.infer<typeof schema>;
// const resolver = zodResolver(schema);

// // remix actions and loaders

// export const loader = ( { request }: LoaderFunctionArgs) => {
//     //get query param

//     // parse the search params for `?q=`
//   const url = new URL(request.url);
//   const sessionCode = url.searchParams.get("sessionCode");

//     return json({ sessionCode });
// };

// export const action = async ({ request }: ActionFunctionArgs) => {

//     const { data, errors, receivedValues } =
//         await getValidatedFormData<FormData>(request, resolver);

//     if (errors) {
//         return json({ errors, receivedValues }, { status: 400 });
//     }


//     // if (!nombre) {
//     //     return json({ error: "Nombre no válido" }, { status: 400 });
//     // }

//     await createPlayer({ name: data.playerName, game_session: data.gameSession, avatar_id: "1" });

//     return json({success: true});
// };

// function ChooseCharacter() {
//     const loaderData = useLoaderData<typeof loader>();
//     const actionData = useActionData<typeof action>();
//     const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

//     const form = useRemixForm<FormData>({
//         mode: "onSubmit",
//         resolver,
//     });

//     const {
//         handleSubmit,
//         register,
//         formState: { errors },
//     } = form;

//     return (
//         <article className="h-full w-full backdrop-blur-[2px] bg-white/70 relative z-10 py-4 px-8 flex flex-col gap-6">
//             <section>
//                 <header className="flex justify-center relative">
//                     <img
//                         src="/assets/buttons/BackButton.png"
//                         alt="Back Button"
//                         className="absolute left-0 size-16"
//                     />
//                     <h1 className="font-dogica-bold text-zinc-900 text-balance text-3xl text-center px-4 py-2 bg-white/80 w-fit rounded-md border-zinc-900 border-[4px] shadow-lg">
//                         ESCOGE TU PERSONAJE
//                     </h1>
//                 </header>
//             </section>
//             <section>
//                 <RemixFormProvider {...form}>
//                     <Form className="flex flex-col gap-4 items-center" method="post" action="/home/chooseCharacter" onSubmit={handleSubmit}>
//                         <div className="flex gap-4 items-center justify-center">
//                             <label htmlFor="name" className="text-2xl font-easvhs">
//                                 Ingresa tu nombre:
//                             </label>
//                             <div className="relative w-fit">
//                                 <img
//                                     src="/assets/components/input.png"
//                                     alt="input"
//                                     className="absolute inset-0 w-full object-fill h-[3.5rem]"
//                                 />
//                                 <input
//                                     {...register("playerName")}
//                                     type="text"
//                                     name="playerName"
//                                     className="bg-transparent relative font-easvhs text-center w-80 h-[3.5rem] px-4 text-xl border-none active:border-none ring-0 focus:ring-0 active:ring-0 outline-none focus:outline-none"
//                                 />
//                                 {errors.playerName && (
//                                     <p className="text-red-500 text-base font-easvhs">
//                                         {errors.playerName.message}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                             <div>
//                                 {
//                                     charactersData.map
//                                 }
//                             </div>
                            
//                         <div className="grid grid-cols-4 grid-rows-1 gap-3">
//                             {
//                                 charactersData.map((character) => (
//                                     <CharacterCard
//                                         key={character.id}
//                                         data={character}
//                                         onSelect={() => setSelectedCharacter(character.id.toString())}
//                                     />
//                                 ))
//                             }
//                         </div>
//                         <div className="flex justify-center">
//                             <Button2 className="font-easvhs text-2xl text-white">
//                                 COMENZAR
//                             </Button2>
//                         </div>
//                     </Form>
//                 </RemixFormProvider>
//             </section>
//         </article>
//     );
// }

// //extends React.HTMLProps<HTMLDivElement>
// interface CharacterCardProps  {
//     data: CharacterData;
//     onSelect: () => void;
// }
// export const CharacterCard = ({
//     data,
//     onSelect
// }: CharacterCardProps) => {
//     const {
//         image,
//         profession,
//         description,
//         color,
//         id
//     } = data;
//     const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
//         if (event.key === 'Enter' || event.key === ' ') {
//             onSelect();
//         }
//     };

    
//     return (
//         <div className="w-[12rem] flex flex-col gap-2" 
//             onClick={onSelect}
//             role="button"
//             tabIndex={0}
//         >
//             <header className="px-4 py-1 border-zinc-900 border-[3px] rounded-sm bg-white">
//                 <h3 className="font-easvhs text-base text-center">
//                 {profession.toUpperCase()}
//                 </h3>
//             </header>
//             <div className="flex flex-col h-full">
//                 <figure className={twMerge("h-44 flex justify-center border-zinc-900 border-[3px] rounded-sm px-2", color)}>
//                 <img
//                     src={image}
//                     alt={profession}
//                     className="object-contain"
//                 />
//                 </figure>
//                 <div className="p-2 border-zinc-900 border-[3px] rounded-sm bg-white border-t-0 h-full">
//                 <p className="font-easvhs text-[10px] text-pretty">
//                     {description}
//                 </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChooseCharacter;
