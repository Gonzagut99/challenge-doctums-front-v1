import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ConsequenceBadge } from "~/components/custom/ConsequenceBadge";
import { EfficiencyPointsTile } from "~/components/custom/EfficienyTile";
import Modal from "~/components/custom/Modal";
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
    modifiableProducts: ModifierFeature[];
    modifiableProjects: ModifierFeature[];
    modifiableResources: ModifierFeature[];
    resultSuccess: consequenceResult;
    resultFailure: consequenceResult;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const eventId = params.eventId;
    if (!eventId) {
        return redirect("/game");
    }
    const domainEvents = await loadEvents("app/data/events.csv");
    const selectedEvent = domainEvents[eventId];
    const efficiencies = await loadEfficiencies("app/data/efficiencies.csv");
    // const products = await loadProducts("app/data/products.csv");
    // const projects = await loadProducts("app/data/projects.csv");
    // const resources = await loadProducts("app/data/resources.csv");
    const { products, projects, resources } = await loadAllModifiersData();
    const requiredEficciencies = selectedEvent.required_efficiencies.map((efficiency) => efficiencies[efficiency]);
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

        })),
        modifiableProjects: modifiableProjects.map((project) => ({
            icon: `/assets/icons/projectsIcon.png`,
            id: Number(project.ID),
            title: project.name,
        })),
        modifiableResources: modifiableResources.map((resource) => ({
            icon: `/assets/icons/resourcesIcon.png`,
            id: Number(resource.ID),
            title: resource.name,
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
    return json({ eventData, eventId });
};

export default function EventDetail() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const productsEfficiencyPoints = 1;
    const resourcesEfficiencyPoints = 3;
    const projectsEfficiencyPoints = 5;
    const data = useLoaderData<typeof loader>();
    const event = data.eventData;
    const eventId = data.eventId;
    const navigate = useNavigate();

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
    }
  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
    {isModalOpen && (
        <Modal title={`Evento N° ${ eventId }`} onDismiss={handleDismiss} type="back">
            <div className="flex flex-col gap-3 py-2">
                <div className="flex flex-col gap-1">
                    <h2 className="font-easvhs text-md">DESCRIPCIÓN</h2>
                    <p className="font-rajdhani leading-tight font-semibold text-sm line-clamp-3 overflow-hidden h-fit">{event.description}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="font-easvhs text-md">
                        EFICIENCIAS QUE HAN DE SER DESAFIADAS
                    </h2>
                    <div className="flex gap-2">
                        {
                            event.requiredEficciencies.map((eff) => {
                                return (
                                    <EfficiencyPointsTile
                                        key={eff.id}
                                        title={eff.title}
                                        points={eff.strength_score}
                                        className="max-w-80 bg-slate-50 basis-1/3"
                                    >
                                        
                                    </EfficiencyPointsTile>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex flex-col bg-zinc-50 border-[3px] border-zinc-900">
                    <div className="border-b-[3px] border-zinc-900 p-1 font-easvhs flex gap-2 bg-[#99C579]">
                        <img src="/assets/icons/check.png" alt="Check" className="size-8" />
                        <p className="text-sm text-center font-rajdhani leading-tight font-semibold">Si tienes o has comprado alguno de estos modificadores, y estos estan activos, te otorgarán puntos para pasar el evento.</p>
                    </div>
                    <div className="py-1 px-2">
                        <div className="grid grid-cols-3 gap-4 font-easvhs">
                            <div className="flex flex-col gap-2">
                                <h3>
                                    Productos
                                </h3>
                                <div className="max-h-[80px] overflow-y-auto scrollbar-thin">
                                    {
                                        event.modifiableProducts.map((product) => (
                                            <ModifierEventFeature
                                                key={product.id}
                                                featureData={product}
                                                profitablePoints={productsEfficiencyPoints}
                                            >
                                            </ModifierEventFeature>
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
                                        event.modifiableProjects.map((project) => (
                                            <ModifierEventFeature
                                                key={project.id}
                                                featureData={project}
                                                profitablePoints={projectsEfficiencyPoints}
                                            >
                                            </ModifierEventFeature>
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
                                        event.modifiableResources.map((resource) => (
                                            <ModifierEventFeature
                                                key={resource.id}
                                                featureData={resource}
                                                profitablePoints={resourcesEfficiencyPoints}
                                            >
                                            </ModifierEventFeature>
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
                        result={event.resultSuccess}
                    ></ConsequenceTile>
                    <ConsequenceTile
                        type="failure"
                        result={event.resultFailure}
                    ></ConsequenceTile>
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
}
export function ModifierEventFeature({ featureData, profitablePoints, ...rest }: ModifierEventFeatureProps) {
    return (
        <div {...rest} className="flex gap-1 items-start font-easvhs py-1">
            <img src={featureData.icon} alt="Efficiency Icon" className="size-6"/>
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
