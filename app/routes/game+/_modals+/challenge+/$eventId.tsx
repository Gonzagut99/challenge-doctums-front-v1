import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button2 } from "~/components/custom/Button2";
import { ConsequenceBadge } from "~/components/custom/ConsequenceBadge";
import { ChallengeEfficiencyPointsTile, EfficiencyPointsTile } from "~/components/custom/EfficienyTile";
import Modal from "~/components/custom/Modal";
import { globalWebSocketService } from "~/services/ws";
// import { Efficiency } from "~/domain/entities";
import { EfficiencyTableTileData } from "~/types/efficiencies";
import { ModifierFeature } from "~/types/modifiers";
import { loadAllModifiersData, loadEfficiencies, loadEvents } from "~/utils/dataLoader";


export type consequenceResult = {
    budget: number;
    score: number;
}

export interface EventData {
    id: string;
    description: string;
    requiredEficciencies: EfficiencyTableTileData[];
    modifiableProducts: {
        icon: string;
        id: number;
        title: string;
        alreadyAcquired: boolean;
        isEnabled: boolean;
    }[];
    modifiableProjects: {
        icon: string;
        id: number;
        title: string;
        alreadyAcquired: boolean;
    }[];
    modifiableResources: {
        icon: string;
        id: number;
        title: string;
        alreadyAcquired: boolean;
    }[];
    resultSuccess: consequenceResult;
    resultFailure: consequenceResult;
}

export type StrengthEfficiencyPointsRequiredPerEventTable = {
    [key: number]: number; //event_level, points_required
}

const strengthEfficiencyPointsRequiredPerEventTable: StrengthEfficiencyPointsRequiredPerEventTable = {
    1: 6,
    2: 12,
    3: 18,
    4: 24,
    5: 30,
    6: 36,
}

// export interface Efficiency {
//     name: string;
//     ID: string;
//     //points: number;
//     modifiable_by_products: string[];
//     modifiable_by_projects: string[];
//     modifiable_by_resources: string[];
//   }

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const eventId = params.eventId;
    if (!eventId) {
        return redirect("/game");
    }
    const domainEvents = await loadEvents("app/data/events.csv");
    const selectedEvent = domainEvents[eventId];
    const domainEfficiencies = await loadEfficiencies("app/data/efficiencies.csv");
    // const products = await loadProducts("app/data/products.csv");
    // const projects = await loadProducts("app/data/projects.csv");
    // const resources = await loadProducts("app/data/resources.csv");
    const { products, projects, resources } = await loadAllModifiersData();
    const myEfficiencies = globalWebSocketService.localPlayerEfficiencies;
    // console.log('my eFFICIENCIES',myEfficiencies);
    // console.log('DOMAIN EFFICIENCIES',domainEfficiencies)
    const myProducts = globalWebSocketService.localPlayerModifiers.products;
    const myProjects = globalWebSocketService.localPlayerModifiers.projects;
    const myResources = globalWebSocketService.localPlayerModifiers.resources;
    const eventResults = globalWebSocketService.eventFlow_results
    const requiredEficciencies = selectedEvent.required_efficiencies.map((efficiency) => {
        return{
            ...domainEfficiencies[efficiency],
            strength_score: myEfficiencies[efficiency] ?? 0
    }});
    const modifiableProducts = selectedEvent.modifiable_products.map((product) => products[product]);
    const modifiableProjects = selectedEvent.modifiable_projects.map((project) => projects[project]);
    const modifiableResources = selectedEvent.modifiable_resources.map((resource) => resources[resource]);
    
    
    const eventData: EventData = {
        id: selectedEvent.ID,
        description: selectedEvent.description,
        requiredEficciencies: requiredEficciencies.map((efficiency) => ({
            id: efficiency.ID,
            title: efficiency.name,
            icon: `/assets/icons/efficiencyIcon.png`,
            strength_score: 0,//later here we will asign the true strength points
        })),
        modifiableProducts: modifiableProducts.map((product) => ({
            icon: `/assets/modifiersIcons/products/${product.ID}.png`,
            id: Number(product.ID),
            title: product.name,
            alreadyAcquired: myProducts.some((myProduct) => myProduct.id === product.ID),
            isEnabled: myProducts.some((myProduct) => myProduct.id === product.ID && myProduct.is_enabled),
        })),
        modifiableProjects: modifiableProjects.map((project) => ({
            icon: `/assets/icons/projectsIcon.png`,
            id: Number(project.ID),
            title: project.name,
            alreadyAcquired: myProjects.some((myProject) => myProject.id === project.ID),
        })),
        modifiableResources: modifiableResources.map((resource) => ({
            icon: `/assets/icons/resourcesIcon.png`,
            id: Number(resource.ID),
            title: resource.name,
            alreadyAcquired: myResources.some((myResource) => myResource.id === resource.ID),
        })),
        resultSuccess: {
            budget: selectedEvent.result_success[0],
            score: selectedEvent.result_success[1]
        },
        resultFailure: {
            budget: selectedEvent.result_failure[0],
            score: selectedEvent.result_failure[1]
        }
    }

    console.log(eventData)
    return json({ eventData, eventId, eventResults });
};

export default function ChallengingEvent() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const productsEfficiencyPoints = 1;
    const resourcesEfficiencyPoints = 3;
    const projectsEfficiencyPoints = 5;
    const { eventData, eventId, eventResults } = useLoaderData<typeof loader>();
    console.log('EVENT DATA',eventData);
    const chosenEfficiency = eventData.requiredEficciencies.filter((eff) => eff.id === eventResults.event.efficiency_chosen)[0];
    console.log('CHOSEN EFFICIENCY',chosenEfficiency);
    const navigate = useNavigate();

    const [showFirstChallengeResults, setShowFirstChallengeResults] = useState(false);
    const [showDiceResults, setShowDiceResults] = useState(false);
    const [showSecondChallengeResults, setShowSecondChallengeResults] = useState(false);

    const handleShowFirstChallengeResults = () => {
        setShowFirstChallengeResults(true);
    }

    const handleShowDiceResults = () => {
        setShowDiceResults(true);
    }

    const handleShowSecondChallengeResults = () => {
        setShowSecondChallengeResults(true);
    }

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
    }

    function handleEventComplete() {
        navigate(-1);

    }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
    {isModalOpen && (
        <Modal title={`Evento N° ${ eventId } de nivel ${eventResults.event.level}`} onDismiss={handleDismiss} type="back">
            <div className="flex flex-col gap-3 py-2 max-h-[500px] overflow-auto scrollbar-thin">
                <div className="flex flex-col gap-1">
                    <h2 className="font-easvhs text-md">DESCRIPCIÓN</h2>
                    <p className="font-easvhs text-sm line-clamp-3 overflow-hidden h-fit">{eventData.description}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="font-easvhs text-md">
                        EFICIENCIAS DESAFIADAS
                    </h2>
                    <div className="flex gap-2">
                        {
                            eventData.requiredEficciencies.map((eff) => {
                                return (
                                    <ChallengeEfficiencyPointsTile
                                        key={eff.id}
                                        title={eff.title}
                                        points={eff.strength_score}
                                        className="max-w-80 bg-slate-50 basis-1/3"
                                        chosen={eventResults.event.efficiency_chosen === eff.id}
                                    >
                                        
                                    </ChallengeEfficiencyPointsTile>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex flex-col bg-zinc-50 border-[3px] border-zinc-900">
                    <div className="border-b-[3px] border-zinc-900 p-1 font-easvhs flex gap-2 bg-[#99C579]">
                        <img src="/assets/icons/check.png" alt="Check" className="size-8" />
                        <p className="text-sm text-center">Si tienes o has comprado alguno de estos modificadores, y estos estan activos, te otorgarán puntos para pasar el evento.</p>
                    </div>
                    <div className="py-1 px-2">
                        <div className="grid grid-cols-3 gap-4 font-easvhs">
                            <div className="flex flex-col gap-2">
                                <h3>
                                    Productos
                                </h3>
                                <div className="max-h-[80px] overflow-y-auto scrollbar-thin">
                                    {
                                        eventData.modifiableProducts.map((product) => (
                                            <ChallengeModifierEventFeature
                                                key={product.id}
                                                featureData={product}
                                                profitablePoints={productsEfficiencyPoints}
                                                alreadyAcquired={product.alreadyAcquired}
                                                type="product"
                                                enabled={product.isEnabled}
                                            >
                                            </ChallengeModifierEventFeature>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3>
                                    Proyectos
                                </h3>
                                <div className="max-h-[80px] overflow-y-auto scrollbar-thin">
                                    {
                                        eventData.modifiableProjects.map((project) => (
                                            <ChallengeModifierEventFeature
                                                key={project.id}
                                                featureData={project}
                                                profitablePoints={projectsEfficiencyPoints}
                                                alreadyAcquired={project.alreadyAcquired}
                                                type="project"
                                            >
                                            </ChallengeModifierEventFeature>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3>
                                    Recursos
                                </h3>
                                <div className="max-h-[80px] overflow-y-auto scrollbar-thin">
                                    {
                                        eventData.modifiableResources.map((resource) => (
                                            <ChallengeModifierEventFeature
                                                alreadyAcquired={resource.alreadyAcquired}
                                                key={resource.id}
                                                featureData={resource}
                                                profitablePoints={resourcesEfficiencyPoints}
                                                type="resource"
                                            >
                                            </ChallengeModifierEventFeature>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <ConsequenceTile
                        type="success"
                        result={eventData.resultSuccess}
                    ></ConsequenceTile>
                    <ConsequenceTile
                        type="failure"
                        result={eventData.resultFailure}
                    ></ConsequenceTile>
                </div>
                <div className='flex flex-col gap-2 justify-center'>
                    <header className="font-easvhs text-xl w-full flex justify-center">
                        <h2>Vamos a comprobar la 1era Prueba</h2>
                    </header>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <h4 className="font-easvhs text-md">
                                La eficiencia con más puntos es:
                            </h4>
                            <EfficiencyPointsTile
                                title={chosenEfficiency.title}
                                points={chosenEfficiency.strength_score}
                                className="max-w-96"
                            ></EfficiencyPointsTile>
                            <p className="text-center text-sm">*Si tienes 0 puntos se escoge una eficiencia random entre las requeridas</p>
                        </div>
                        <div className="flex flex-col gap-1 items-center">
                            <p className="text-base">
                                Los eventos de <span className="font-black">{`Nivel ${eventResults.event.level}`}</span> requieren al menos <span className="font-black">{`${strengthEfficiencyPointsRequiredPerEventTable[eventResults.event.level]} puntos de eficiencia`}</span> para pasar.
                            </p>
                            {
                                !showFirstChallengeResults && <Button2 className="text-zinc-50 h-10" onClick={handleShowFirstChallengeResults}>Enfrentar la 1era prueba</Button2>
                            }
                            {
                                showFirstChallengeResults && !eventResults.event.pass_first_challenge && (
                                    <div className="flex flex-col gap-1 py-4 px-44">
                                        <p className="text-center text-2xl font-medium">
                                            No pasaste la 1era prueba. 😪
                                        </p>
                                        <p className="text-center">
                                            Tienes <span className="font-black">{chosenEfficiency.strength_score}</span> puntos en la eficiencia <span className="italic">{`"${chosenEfficiency.title}"`}</span>.
                                        </p>
                                        <p className="text-center">
                                            Necesitas <span className="font-black">{strengthEfficiencyPointsRequiredPerEventTable[eventResults.event.level]}</span> puntos para pasar.
                                        </p>
                                        <p className="text-center">
                                            Tendremos que lanzar los dados para enfrentar tu eficiencia con los puntos de riesgo que te dan los dados.
                                        </p>
                                    </div>
                                )
                            }
                            {
                                showFirstChallengeResults && !eventResults.event.pass_first_challenge && !showDiceResults && (
                                    <Button2 className="text-zinc-50 h-16" onClick={handleShowDiceResults}>Lanzar dados para enfrentar la segunda prueba</Button2>
                                )
                            }
                            {
                                showFirstChallengeResults && !eventResults.event.pass_first_challenge && showDiceResults && !showSecondChallengeResults && (
                                    <>
                                        <div className="flex flex-col gap-1 py-4 px-44 justify-center items-center">
                                            <p className="text-center text-2xl font-medium">
                                                Lanzaste los dados y obtuviste <span className="font-bold">{eventResults.event.risk_points}</span> puntos de riesgo.
                                            </p>
                                            <div className="border-[3px] border-zinc-900 bg-[#6366F1] flex gap-2 items-center justify-center w-fit min-h-[60px] px-4 rounded-md ">
                                                {eventResults.event.risk_challenge_dices.map(
                                                    (dice: number) => (
                                                        // <img key={dice} className="text-white font-easvhs text-lg">{dice}</img>
                                                        <img
                                                            key={dice}
                                                            src={`/assets/dices/${dice}.png`}
                                                            alt={`dice${dice}`}
                                                            className="size-[50px] object-contain"
                                                        />
                                                    )
                                                )}
                                            </div>
                                            <p className="text-center">
                                                Recuerda que tienes <span className="font-black">{chosenEfficiency.strength_score}</span> puntos en la eficiencia <span className="italic">{`"${chosenEfficiency.title}"`}</span>.
                                            </p>
                                        
                                        </div>
                                        <Button2 className="text-zinc-50 h-10" onClick={() => handleShowSecondChallengeResults()}>
                                            Enfrentar la 2da prueba
                                        </Button2>
                                    </>
                                )
                            }
                            {
                                showFirstChallengeResults && !eventResults.event.pass_first_challenge && showDiceResults && showSecondChallengeResults && !eventResults.event.pass_second_challenge && (
                                    <>
                                        <div className="flex flex-col gap-1 py-4 px-44">
                                            <p className="text-center text-2xl font-medium">
                                                No pasaste la 2da prueba. 😪
                                            </p>
                                            <p className="text-center">
                                                Tienes <span className="font-bold">{chosenEfficiency.strength_score}</span> puntos en la eficiencia {chosenEfficiency.title}.
                                            </p>
                                            <p className="text-center">
                                                Necesitabas superar los <span className="font-bold">{eventResults.event.risk_points}</span> puntos para pasar.
                                            </p>
                                        </div>
                                        <Button2 className="text-zinc-50 h-10" onClick={handleEventComplete}>
                                            Aceptar
                                        </Button2>
                                    </>
                                )
                            }
                            {
                                showFirstChallengeResults && !eventResults.event.pass_first_challenge && showDiceResults && showSecondChallengeResults && eventResults.event.pass_second_challenge && (
                                    <>
                                        <div className="flex flex-col gap-2 py-4 px-44">
                                            <p className="text-center text-2xl font-medium">
                                                Pasaste la 2da prueba. 🎉
                                            </p>
                                            <p className="text-center">
                                                Tienes <span className="font-black">{chosenEfficiency.strength_score}</span> puntos en la eficiencia {chosenEfficiency.title}.
                                            </p>
                                            <p className="text-center">
                                                Necesitabas superar los <span className="font-black">{eventResults.event.risk_points}</span> puntos de riesgo para pasar y lo lograste.
                                            </p>
                                        </div>
                                        <Button2 className="text-zinc-50 h-10" onClick={handleEventComplete}>
                                            Aceptar
                                        </Button2>
                                    </>
                                    
                                )
                            }
                            {
                                showFirstChallengeResults && eventResults.event.pass_first_challenge && !showDiceResults && (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-center text-2xl font-medium">
                                                Pasaste la 1era prueba. 🎉
                                            </p>
                                            <p className="text-center">
                                                Tienes <span className="font-bold">{chosenEfficiency.strength_score}</span> puntos en la eficiencia {chosenEfficiency.title}.
                                            </p>
                                            <p className="text-center">
                                                Necesitabas <span className="font-bold">{strengthEfficiencyPointsRequiredPerEventTable[eventResults.event.level]}</span> puntos para pasar y cumpliste.
                                            </p>
                                        </div>
                                        <Button2 className="text-zinc-50 h-10" onClick={handleEventComplete}>
                                            Aceptar
                                        </Button2>
                                    </>
                                )
                            }
                            {
                                showFirstChallengeResults && eventResults.event.pass_first_challenge && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-center text-2xl font-medium">
                                            Pasaste la 1era prueba. 🎉
                                        </p>
                                        <p className="text-center">
                                            Tienes <span className="font-bold">{chosenEfficiency.strength_score}</span> puntos en la eficiencia {chosenEfficiency.title}.
                                        </p>
                                        <p className="text-center">
                                            Necesitabas <span className="font-bold">{strengthEfficiencyPointsRequiredPerEventTable[eventResults.event.level]}</span> puntos para pasar y cumpliste.
                                        </p>
                                    </div>
                                )
                            }


                        </div>
                    </div>
                </div>
            </div>

        </Modal>
    )}
    </AnimatePresence>
  )
}

interface ModifierEventFeatureProps extends React.HTMLProps<HTMLDivElement> {
    featureData: ModifierFeature;
    profitablePoints: number;
    alreadyAcquired: boolean;
    type?:'product' | 'project' | 'resource';
    enabled?: boolean;
}
export function ChallengeModifierEventFeature({ featureData, profitablePoints, alreadyAcquired, type, enabled,...rest }: ModifierEventFeatureProps) {
    return (
        <div {...rest} className="flex gap-1 items-start font-easvhs py-1">
            <div className="w-fit relative">
                {
                    type=='product' && alreadyAcquired && enabled && <div className="w-fit absolute inset-0 backdrop-blur-0 bg-zinc-50/80 z-10">
                    <img src="/assets/icons/check.png" alt="backdrop" className="size-6" title="Producto adquirido y activo"/>
                </div>}
                {
                    (type=='project' || type=='resource') && alreadyAcquired && <div className="w-fit absolute inset-0 backdrop-blur-0 bg-zinc-50/80 z-10">
                    <img src="/assets/icons/check.png" alt="backdrop" className="size-6" title="Modificador adquirido"/>
                </div>}
                <img src={featureData.icon} alt="Efficiency Icon" className="size-6"/>
            </div>
            <div className="flex flex-col flex-grow">
                <p className="text-xs">
                    { featureData.title }
                </p>
            </div>
            <div className="w-fit min-w-10">
                <span className="text-lg">
                    + { profitablePoints }
                </span>
            </div>
        </div>
    );
}

interface ConsequenceTileProps extends React.HTMLProps<HTMLDivElement> {
    type: "success" | "failure";
    result: consequenceResult;
    className?: string;
}

export function ConsequenceTile({ type, result, className, ...rest }: ConsequenceTileProps) {
    const twBorderColor = type === "success" ? "border-green-600" : "border-red-600";
    return (
        <div {...rest} className={
            twMerge(
                "flex flex-col gap-1 font-easvhs bg-zinc-50 border-[3px] border-zinc-900 p-1 rounded-sm",
                twBorderColor,
                className
            )
        }>
            <h3 className="text-center text-base">
                { type === "success" ? "Si pasas" : "Si fracasas" }
            </h3>
            <p className="text-sm text-center">
                { type === "success" ? "Por la credibilidad, se te otorgará" : "Se te restará" }
            </p>
            <div className="grid grid-cols-2 gap-2">
                <ConsequenceBadge
                    type={type}
                    variant="budget"
                    className="justify-center"
                >
                    { result.budget }
                </ConsequenceBadge>
                <ConsequenceBadge
                    type={type}
                    variant="score"
                    className="justify-center"
                >
                    { result.score }
                </ConsequenceBadge>
            </div>

            {/* <div className="flex gap-2 items-center">
                <img src="/assets/icons/cashIcon.png" alt="Cash Icon" className="size-6"/>
                <span className="text-lg">
                    { result.budget }
                </span>
            </div>
            <div className="flex gap-2 items-center">
                <img src="/assets/icons/starIcon.png" alt="Star Icon" className="size-6"/>
                <span className="text-lg">
                    { result.score }
                </span>
            </div> */}
        </div>
    );
}



// type StreamedEfficiencyData = {
//     [key: string]: number;
// }

// const myStreamedEfficiencyData: StreamedEfficiencyData = {
//     '1': 0,
//     '2': 0,
//     '3': 0,
//     '4': 0,
//     '5': 5,
//     '6': 0,
//     '7': 0,
//     '8': 10,
//     '9': 0,
//     '10': 0,
//     '11': 0,
//     '12': 0
//   }

// const efficiencies= await loadEfficiencies("app/data/efficiencies.csv");
// const myEfficiencies: EfficiencyTableTileData[] = Object.values(efficiencies).map((efficiency) => ({
//     id: efficiency.ID,
//     title: efficiency.name,
//     icon: `/assets/modifiersIcons/efficiencies/${efficiency.ID}.png`,
//     strength_score: myStreamedEfficiencyData[efficiency.ID],
// }));
