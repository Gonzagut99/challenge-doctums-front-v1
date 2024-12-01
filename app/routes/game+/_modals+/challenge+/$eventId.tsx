import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button2 } from "~/components/custom/Button2";
import { ConsequenceBadge } from "~/components/custom/ConsequenceBadge";
import {
    ChallengeEfficiencyPointsTile,
    EfficiencyPointsTile,
} from "~/components/custom/EfficienyTile";
import Modal from "~/components/custom/Modal";
import { Separator } from "~/components/ui/separator";
import { globalWebSocketService } from "~/services/ws";
// import { Efficiency } from "~/domain/entities";
import { EfficiencyTableTileData } from "~/types/efficiencies";
import { ModifierFeature } from "~/types/modifiers";
import {
    allLoadedData,
    efficienciesData,
    eventsData,
    loadAllModifiersData,
    loadEfficiencies,
    loadEvents,
} from "~/utils/dataLoader";

export type ConsequenceResult = {
    budget: number;
    score: number;
};

export interface EventData {
    id: string;
    description: string;
    requiredEficciencies: EfficiencyTableTileData[];
    requiredUpdatedEficciencies: EfficiencyTableTileData[];
    previousChosenEfficiencyData:EfficiencyTableTileData;
    updatedChosenEfficiencyData:EfficiencyTableTileData;
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
    resultSuccess: ConsequenceResult;
    resultFailure: ConsequenceResult;
}

export type StrengthEfficiencyPointsRequiredPerEventTable = {
    [key: number]: number; //event_level, points_required
};

const strengthEfficiencyPointsRequiredPerEventTable: StrengthEfficiencyPointsRequiredPerEventTable =
    {
        1: 6,
        2: 12,
        3: 18,
        4: 24,
        5: 30,
        6: 36,
    };

const original_points_by_resource = {
    product: 1,
    project: 5,
    resource: 3,
};

const product_points_by_level = {
    1: 5,
    2: 4,
    3: 3,
    4: 2,
    5: 1,
    6: 1,
};
const project_points_by_level = {
    1: 2,
    2: 2,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
};
const resource_points_by_level = {
    1: 3,
    2: 3,
    3: 2,
    4: 2,
    5: 1,
    6: 1,
};

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
    const domainEvents = eventsData;
    const selectedEvent = domainEvents[eventId];
    const domainEfficiencies = efficienciesData;
    const eventResults = globalWebSocketService.eventFlow_results;
    // const products = productsData;
    // const projects = await loadProducts("app/data/projects.csv");
    // const resources = await loadProducts("app/data/resources.csv");
    const { products, projects, resources } = allLoadedData;
    const myPreviousEfficiencies =
        globalWebSocketService.localPlayerPreviousEfficiencies;
    const myEfficiencies = globalWebSocketService.localPlayerEfficiencies;
    // console.log('my eFFICIENCIES',myEfficiencies);
    // console.log('DOMAIN EFFICIENCIES',domainEfficiencies)
    const myProducts = globalWebSocketService.localPlayerModifiers.products;
    const myProjects = globalWebSocketService.localPlayerModifiers.projects;
    const myResources = globalWebSocketService.localPlayerModifiers.resources;
    const selectedEfficiency = eventResults.event.efficiency_chosen;
    const selectedEfficiencyEventModifiers = {
        products: domainEfficiencies[selectedEfficiency].modifiable_by_products,
        projects: domainEfficiencies[selectedEfficiency].modifiable_by_projects,
        resources:
            domainEfficiencies[selectedEfficiency].modifiable_by_resources,
    };
    const requiredEficciencies = selectedEvent.required_efficiencies.map(
        (efficiency) => {
            return {
                ...domainEfficiencies[efficiency],
                strength_score: myPreviousEfficiencies[efficiency] ?? 0,
            };
        }
    );

    const requiredUpdatedEficciencies = selectedEvent.required_efficiencies.map(
        (efficiency) => {
            return {
                ...domainEfficiencies[efficiency],
                strength_score: myEfficiencies[efficiency] ?? 0,
            };
        }
    )

    // const modifiableProducts = selectedEvent.modifiable_products.map((product) => products[product]);
    // const modifiableProjects = selectedEvent.modifiable_projects.map((project) => projects[project]);
    // const modifiableResources = selectedEvent.modifiable_resources.map((resource) => resources[resource]);

    const modifiableProducts = selectedEfficiencyEventModifiers.products.map(
        (product) => products[product]
    );
    const modifiableProjects = selectedEfficiencyEventModifiers.projects.map(
        (project) => projects[project]
    );
    const modifiableResources = selectedEfficiencyEventModifiers.resources.map(
        (resource) => resources[resource]
    );

    const eventData: EventData = {
        id: selectedEvent.ID,
        description: selectedEvent.description,
        requiredEficciencies: requiredEficciencies.map((efficiency) => ({
            id: efficiency.ID,
            title: efficiency.name,
            icon: `/assets/icons/efficiencyIcon.png`,
            strength_score: efficiency.strength_score ?? 0,
            //strength_score: eventResults.player.effiencies[efficiency.ID],//later here we will asign the true strength points
        })),
        requiredUpdatedEficciencies: requiredUpdatedEficciencies.map((efficiency) => ({
            id: efficiency.ID,
            title: efficiency.name,
            icon: `/assets/icons/efficiencyIcon.png`,
            strength_score: efficiency.strength_score ?? 0,
            //strength_score: eventResults.player.effiencies[efficiency.ID],//later here we will asign the true strength points
        })),
        previousChosenEfficiencyData: {
            id: selectedEfficiency,
            title: domainEfficiencies[selectedEfficiency].name,
            icon: `/assets/icons/efficiencyIcon.png`,
            strength_score: myPreviousEfficiencies[selectedEfficiency] ?? 0,
        },
        updatedChosenEfficiencyData: {
            id: selectedEfficiency,
            title: domainEfficiencies[selectedEfficiency].name,
            icon: `/assets/icons/efficiencyIcon.png`,
            strength_score: myEfficiencies[selectedEfficiency] ?? 0,
        },
        modifiableProducts: modifiableProducts.map((product) => ({
            icon: `/assets/modifiersIcons/products/${product.ID}.png`,
            id: Number(product.ID),
            title: product.name,
            alreadyAcquired: myProducts.some(
                (myProduct) => myProduct.id === product.ID
            ),
            isEnabled: myProducts.some(
                (myProduct) =>
                    myProduct.id === product.ID && myProduct.is_enabled
            ),
        })),
        modifiableProjects: modifiableProjects.map((project) => ({
            icon: `/assets/icons/projectsIcon.png`,
            id: Number(project.ID),
            title: project.name,
            alreadyAcquired: myProjects.some(
                (myProject) => myProject.id === project.ID
            ),
        })),
        modifiableResources: modifiableResources.map((resource) => ({
            icon: `/assets/icons/resourcesIcon.png`,
            id: Number(resource.ID),
            title: resource.name,
            alreadyAcquired: myResources.some(
                (myResource) => myResource.id === resource.ID
            ),
        })),
        resultSuccess: {
            budget: selectedEvent.result_success[1],
            score: selectedEvent.result_success[0],
        },
        resultFailure: {
            budget: selectedEvent.result_failure[1],
            score: selectedEvent.result_failure[0],
        },
    };

    const multipliers = {
        products:
            product_points_by_level[
                eventResults.event.level as keyof typeof product_points_by_level
            ],
        projects:
            project_points_by_level[
                eventResults.event.level as keyof typeof project_points_by_level
            ],
        resources:
            resource_points_by_level[
                eventResults.event
                    .level as keyof typeof resource_points_by_level
            ],
    };

    const pointSystem = {
        products: original_points_by_resource.product * multipliers.products,
        projects: original_points_by_resource.project * multipliers.projects,
        resources: original_points_by_resource.resource * multipliers.resources,
    };

    const profittableEffiencyModifiers = {
        products: eventData.modifiableProducts.filter(
            (product) => product.isEnabled && product.alreadyAcquired
        ).length,
        projects: eventData.modifiableProjects.filter(
            (project) => project.alreadyAcquired
        ).length,
        resources: eventData.modifiableResources.filter(
            (resource) => resource.alreadyAcquired
        ).length,
    };

    const chosenEfficiencyPoints = {
        products: profittableEffiencyModifiers.products * pointSystem.products,
        projects: profittableEffiencyModifiers.projects * pointSystem.projects,
        resources:
            profittableEffiencyModifiers.resources * pointSystem.resources,
    };

    const efficiencyPointsCalculus = {
        selectedEfficiency: eventResults.event.efficiency_chosen,
        previousStrengthPoints:
            myPreviousEfficiencies[eventResults.event.efficiency_chosen] ?? 0,
        requiredPoints:
            strengthEfficiencyPointsRequiredPerEventTable[
                eventResults.event.level
            ],
        pointSystem: pointSystem,
        expectedEfficiencyGrantedPoints:
            eventResults.event.rewards.obtained_efficiencies_points,
        riskPoints: eventResults.event.risk_points,
        profitableEfficiencyModifiers: profittableEffiencyModifiers,
        chosenEfficiencyPoints: chosenEfficiencyPoints,
        totalModifiersPoints: Object.values(chosenEfficiencyPoints).reduce(
            (acc, curr) => acc + curr,
            0
        ),
    };

    console.log(eventData);
    return json({ eventData, eventId, eventResults, efficiencyPointsCalculus });
};

export default function ChallengingEvent() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const { eventData, eventId, eventResults, efficiencyPointsCalculus } =
        useLoaderData<typeof loader>();
    const pointsSystemPerEfficiencyProducts =
        efficiencyPointsCalculus.pointSystem.products;
    const pointsSystemPerEfficiencyResources =
        efficiencyPointsCalculus.pointSystem.resources;
    const pointsSystemPerEffficiencyProjects =
        efficiencyPointsCalculus.pointSystem.projects;

    console.log("EVENT DATA", eventData);
    const prevChosenEfficiency = eventData.previousChosenEfficiencyData
    const updatedChosenEfficiency = eventData.updatedChosenEfficiencyData;
    console.log("Prev CHOSEN EFFICIENCY", prevChosenEfficiency);
    console.log("UPDATED CHOSEN EFFICIENCY", updatedChosenEfficiency);
    const navigate = useNavigate();

    const [showFirstChallengeResults, setShowFirstChallengeResults] =
        useState(false);
    const [showDiceResults, setShowDiceResults] = useState(false);
    const [showSecondChallengeResults, setShowSecondChallengeResults] =
        useState(false);

    const handleShowFirstChallengeResults = () => {
        setShowFirstChallengeResults(true);
    };

    const handleShowDiceResults = () => {
        setShowDiceResults(true);
    };

    const handleShowSecondChallengeResults = () => {
        setShowSecondChallengeResults(true);
    };

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
                <Modal
                    title={`Evento N° ${eventId} de nivel ${eventResults.event.level}`}
                    onDismiss={handleDismiss}
                    type="back"
                >
                    <div className="flex flex-col gap-3 py-2 max-h-[500px] overflow-auto scrollbar-thin">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-easvhs text-md">DESCRIPCIÓN</h2>
                            <p className="font-rajdhani text-base line-clamp-3 leading-tight overflow-hidden h-fit font-semibold">
                                {eventData.description}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="font-easvhs text-md">
                                EFICIENCIAS DESAFIADAS
                            </h2>
                            <div className="flex gap-2">
                                {eventData.requiredEficciencies.map((eff) => {
                                    return (
                                        <ChallengeEfficiencyPointsTile
                                            key={eff.id}
                                            title={eff.title}
                                            points={eff.strength_score}
                                            className="max-w-80 bg-slate-50 basis-1/3"
                                            chosen={
                                                eventResults.event
                                                    .efficiency_chosen ===
                                                eff.id
                                            }
                                        ></ChallengeEfficiencyPointsTile>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex flex-col bg-zinc-50 border-[3px] border-zinc-900">
                            <div className="border-b-[3px] border-zinc-900 p-1 font-easvhs flex gap-2 bg-[#99C579]">
                                <img
                                    src="/assets/icons/check.png"
                                    alt="Check"
                                    className="size-8"
                                />
                                <p className="text-base text-center font-rajdhani font-semibold leading-tight ">
                                    Si tienes o has comprado alguno de estos
                                    modificadores, y estos estan activos, te
                                    otorgarán puntos para pasar el evento.
                                </p>
                            </div>
                            <div className="py-1 px-2">
                                <div className="grid grid-cols-3 gap-4 font-easvhs">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <h3>Productos</h3>
                                            <div className="flex space-x-1">
                                                <span>
                                                    {
                                                        efficiencyPointsCalculus
                                                            .profitableEfficiencyModifiers
                                                            .products
                                                    }
                                                </span>
                                                <img
                                                    src="/public/assets/icons/check.png"
                                                    alt="Check"
                                                    title="Número de productos activados"
                                                    className="size-3 min-w-3 aspect-square"
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-[80px] overflow-y-auto scrollbar-thin">
                                            {eventData.modifiableProducts.map(
                                                (product) => (
                                                    <ChallengeModifierEventFeature
                                                        key={product.id}
                                                        featureData={product}
                                                        profitablePoints={
                                                            pointsSystemPerEfficiencyProducts
                                                        }
                                                        alreadyAcquired={
                                                            product.alreadyAcquired
                                                        }
                                                        type="product"
                                                        enabled={
                                                            product.isEnabled
                                                        }
                                                    ></ChallengeModifierEventFeature>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <h3>Proyectos</h3>
                                            <div className="flex space-x-1">
                                                <span>
                                                    {
                                                        efficiencyPointsCalculus
                                                            .profitableEfficiencyModifiers
                                                            .projects
                                                    }
                                                </span>
                                                <img
                                                    src="/public/assets/icons/check.png"
                                                    alt="Check"
                                                    title="Número de productos activados"
                                                    className="size-3 min-w-3 aspect-square"
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-[80px] overflow-y-auto scrollbar-thin">
                                            {eventData.modifiableProjects.map(
                                                (project) => (
                                                    <ChallengeModifierEventFeature
                                                        key={project.id}
                                                        featureData={project}
                                                        profitablePoints={
                                                            pointsSystemPerEffficiencyProjects
                                                        }
                                                        alreadyAcquired={
                                                            project.alreadyAcquired
                                                        }
                                                        type="project"
                                                    ></ChallengeModifierEventFeature>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <h3>Recursos</h3>
                                            <div className="flex space-x-1">
                                                <span>
                                                    {
                                                        efficiencyPointsCalculus
                                                            .profitableEfficiencyModifiers
                                                            .resources
                                                    }
                                                </span>
                                                <img
                                                    src="/public/assets/icons/check.png"
                                                    alt="Check"
                                                    title="Número de productos activados"
                                                    className="size-3 min-w-3 aspect-square"
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-[80px] overflow-y-auto scrollbar-thin">
                                            {eventData.modifiableResources.map(
                                                (resource) => (
                                                    <ChallengeModifierEventFeature
                                                        alreadyAcquired={
                                                            resource.alreadyAcquired
                                                        }
                                                        key={resource.id}
                                                        featureData={resource}
                                                        profitablePoints={
                                                            pointsSystemPerEfficiencyResources
                                                        }
                                                        type="resource"
                                                    ></ChallengeModifierEventFeature>
                                                )
                                            )}
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
                        <div className="flex flex-col gap-2 justify-center">
                            <header className="font-rajdhani leading-tight font-semibold text-2xl w-full flex justify-center">
                                <h2>Vamos a comprobar la 1era Prueba</h2>
                            </header>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-1 items-center justify-center">
                                    <h4 className="font-rajdhani leading-tight font-semibold text-lg">
                                        La eficiencia con más puntos es:
                                    </h4>
                                    <EfficiencyPointsTile
                                        title={prevChosenEfficiency.title}
                                        points={prevChosenEfficiency.strength_score}
                                        className="max-w-96"
                                    ></EfficiencyPointsTile>
                                    <p className="text-center text-sm">
                                        *Si tienes 0 puntos se escoge una
                                        eficiencia random entre las requeridas
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 items-center font-rajdhani font-semibold leading-tight">
                                    <p className="text-base">
                                        Los eventos de{" "}
                                        <span className="font-black">{`Nivel ${eventResults.event.level}`}</span>{" "}
                                        requieren al menos{" "}
                                        <span className="font-black">{`${
                                            strengthEfficiencyPointsRequiredPerEventTable[
                                                eventResults.event.level
                                            ]
                                        } puntos de eficiencia`}</span>{" "}
                                        para pasar.
                                    </p>
                                    {!showFirstChallengeResults && (
                                        <Button2
                                            className="text-zinc-50 h-10"
                                            onClick={
                                                handleShowFirstChallengeResults
                                            }
                                        >
                                            Enfrentar la 1era prueba
                                        </Button2>
                                    )}
                                    {showFirstChallengeResults &&
                                        !eventResults.event
                                            .pass_first_challenge && (
                                            <>
                                                <Separator
                                                    orientation="vertical"
                                                    className="w-full h-[3px] my-3"
                                                ></Separator>
                                                <div className="flex flex-col gap-1 py-4 px-44">
                                                    <p className="text-center text-2xl font-medium text-red-600">
                                                        No pasaste la 1era
                                                        prueba. 😪
                                                    </p>
                                                    <div className="grid grid-cols-3">
                                                        {/* <div className="flex flex-col gap-1 items-center">
                                                            <p className="text-center">
                                                                Productos:
                                                            </p>
                                                            <p className="text-center font-black">
                                                                {
                                                                    efficiencyPointsCalculus
                                                                        .chosenEfficiencyPoints
                                                                        .products
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col gap-1 items-center">
                                                            <p className="text-center">
                                                                Proyectos:
                                                            </p>
                                                            <p className="text-center font-black">
                                                                {
                                                                    efficiencyPointsCalculus
                                                                        .chosenEfficiencyPoints
                                                                        .projects
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col gap-1 items-center">
                                                            <p className="text-center">
                                                                Recursos:
                                                            </p>
                                                            <div className="flex space-x-2">
                                                                <div className="flex space-x-1">
                                                                    <span>
                                                                        {
                                                                            efficiencyPointsCalculus
                                                                                .profitableEfficiencyModifiers
                                                                                .resources
                                                                        }
                                                                    </span>
                                                                    <img
                                                                        src="/public/assets/icons/check.png"
                                                                        alt="Check"
                                                                        title="Número de productos activados"
                                                                        className="size-3 min-w-3 aspect-square"
                                                                    />
                                                                </div>
                                                                <p>
                                                                    x{" "}
                                                                    <span className="text-green-600">
                                                                        {
                                                                            resourcesEfficiencyPoints
                                                                        }
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <p className="text-center font-black">
                                                                {
                                                                    efficiencyPointsCalculus
                                                                        .chosenEfficiencyPoints
                                                                        .resources
                                                                }
                                                            </p>
                                                        </div> */}
                                                        <CalculusColumnTable
                                                            type="Productos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .products
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEfficiencyProducts
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .products
                                                            }
                                                        ></CalculusColumnTable>
                                                        <CalculusColumnTable
                                                            type="Proyectos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .projects
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEffficiencyProjects
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .projects
                                                            }
                                                        ></CalculusColumnTable>
                                                        <CalculusColumnTable
                                                            type="Recursos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .resources
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEfficiencyResources
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .resources
                                                            }
                                                        ></CalculusColumnTable>
                                                    </div>
                                                    <div>
                                                        {/* <table className="max-h-[400px]">
                                                            <thead>
                                                                <tr>
                                                                    <th>
                                                                        Total
                                                                        Modificadores
                                                                    </th>
                                                                    <th>
                                                                        Total
                                                                        Eficiencia
                                                                    </th>
                                                                    <th>
                                                                        Total
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        {
                                                                            efficiencyPointsCalculus.totalModifiersPoints
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            efficiencyPointsCalculus.previousStrengthPoints
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {efficiencyPointsCalculus.totalModifiersPoints +
                                                                            efficiencyPointsCalculus.previousStrengthPoints}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table> */}
                                                        <TotalPointsTable
                                                            previousStrengthPoints={efficiencyPointsCalculus.previousStrengthPoints}
                                                            totalModifiersPoints={efficiencyPointsCalculus.totalModifiersPoints}
                                                            type="failure"
                                                        ></TotalPointsTable>
                                                    </div>
                                                    <p className="text-center">
                                                        Tendrías{" "}
                                                        <span className="font-black">
                                                            {
                                                                updatedChosenEfficiency.strength_score
                                                            }
                                                        </span>{" "}
                                                        puntos en la eficiencia{" "}
                                                        <span className="italic">{`"${updatedChosenEfficiency.title}"`}</span>
                                                        .
                                                    </p>
                                                    <p className="text-center">
                                                        Necesitas{" "}
                                                        <span className="font-black">
                                                            {
                                                                strengthEfficiencyPointsRequiredPerEventTable[
                                                                    eventResults
                                                                        .event
                                                                        .level
                                                                ]
                                                            }
                                                        </span>{" "}
                                                        puntos para pasar.
                                                    </p>
                                                    <p className="text-center">
                                                        Tendremos que lanzar los
                                                        dados para enfrentar tu
                                                        eficiencia con los
                                                        puntos de riesgo que te
                                                        dan los dados.
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    {showFirstChallengeResults &&
                                        !eventResults.event
                                            .pass_first_challenge &&
                                        !showDiceResults && (
                                            <Button2
                                                className="text-zinc-50 h-16"
                                                onClick={handleShowDiceResults}
                                            >
                                                Lanzar dados para enfrentar la
                                                segunda prueba
                                            </Button2>
                                        )}
                                    {showFirstChallengeResults &&
                                        !eventResults.event
                                            .pass_first_challenge &&
                                        showDiceResults &&
                                        !showSecondChallengeResults && (
                                            <>
                                                <Separator
                                                    orientation="vertical"
                                                    className="w-full h-[3px] my-3"
                                                ></Separator>
                                                <div className="flex flex-col gap-1 py-4 px-44 justify-center items-center">
                                                    <p className="text-center text-2xl font-medium">
                                                        Lanzaste los dados y
                                                        obtuviste{" "}
                                                        <span className="font-bold">
                                                            {
                                                                eventResults
                                                                    .event
                                                                    .risk_points
                                                            }
                                                        </span>{" "}
                                                        puntos de riesgo.
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
                                                    <div className="grid grid-cols-3 w-full">
                                                        <CalculusColumnTable
                                                            type="Productos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .products
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEfficiencyProducts
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .products
                                                            }
                                                        ></CalculusColumnTable>
                                                        <CalculusColumnTable
                                                            type="Proyectos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .projects
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEffficiencyProjects
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .projects
                                                            }
                                                        ></CalculusColumnTable>
                                                        <CalculusColumnTable
                                                            type="Recursos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .resources
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEfficiencyResources
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .resources
                                                            }
                                                        ></CalculusColumnTable>
                                                    </div>
                                                    <div>
                                                        <TotalPointsTable
                                                            previousStrengthPoints={efficiencyPointsCalculus.previousStrengthPoints}
                                                            totalModifiersPoints={efficiencyPointsCalculus.totalModifiersPoints}
                                                            type="success"
                                                        ></TotalPointsTable>
                                                    </div>
                                                    <p className="text-center">
                                                        De modo que tendrías{" "}
                                                        <span className="font-black">
                                                            {
                                                                updatedChosenEfficiency.strength_score
                                                            }
                                                        </span>{" "}
                                                        puntos en la eficiencia{" "}
                                                        <span className="italic">{`"${updatedChosenEfficiency.title}"`}</span>
                                                        .
                                                    </p>

                                                </div>
                                                <Button2
                                                    className="text-zinc-50 h-10"
                                                    onClick={() =>
                                                        handleShowSecondChallengeResults()
                                                    }
                                                >
                                                        Enfrentar la 2da prueba
                                                </Button2>
                                            </>
                                        )}
                                    {showFirstChallengeResults &&
                                        !eventResults.event
                                            .pass_first_challenge &&
                                        showDiceResults &&
                                        showSecondChallengeResults &&
                                        !eventResults.event
                                            .pass_second_challenge && (
                                    <>
                                                <>
                                                <Separator
                                                    orientation="vertical"
                                                    className="w-full h-[3px] my-3"
                                                ></Separator>
                                                <div className="flex flex-col gap-1 py-4 px-44">
                                                        <p className="text-center text-2xl font-medium text-red-600">
                                                            No pasaste la 2da
                                                        prueba. 😪
                                                        </p>
                                                        <div className="grid grid-cols-3">
                                                        <CalculusColumnTable
                                                            type="Productos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .products
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEfficiencyProducts
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .products
                                                            }
                                                        ></CalculusColumnTable>
                                                        <CalculusColumnTable
                                                            type="Proyectos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .projects
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEffficiencyProjects
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .projects
                                                            }
                                                        ></CalculusColumnTable>
                                                        <CalculusColumnTable
                                                            type="Recursos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .resources
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEfficiencyResources
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .resources
                                                            }
                                                        ></CalculusColumnTable>
                                                    </div>
                                                    <div>
                                                        <TotalPointsTable
                                                            previousStrengthPoints={efficiencyPointsCalculus.previousStrengthPoints}
                                                            totalModifiersPoints={efficiencyPointsCalculus.totalModifiersPoints}
                                                            type="failure"
                                                        ></TotalPointsTable>
                                                    </div>
                                                    <p className="text-center">
                                                            Así que tendrias{" "}
                                                        <span className="font-bold">
                                                            {
                                                                updatedChosenEfficiency.strength_score
                                                            }
                                                        </span>{" "}
                                                        puntos en la eficiencia{" "}
                                                        <span className="italic">{`"${updatedChosenEfficiency.title}"`}</span>
                                                        .
                                                        </p>
                                                        <p className="text-center">
                                                            Necesitabas superar los{" "}
                                                        <span className="font-bold">
                                                            {
                                                                eventResults
                                                                    .event
                                                                    .risk_points
                                                            }
                                                        </span>{" "}
                                                        puntos para pasar.
                                                        </p>
                                                    </div>
                                        {/* <Button2 className="text-zinc-50 h-10" onClick={handleEventComplete}>
                                            Aceptar
                                        </Button2> */}
                                    </>
                                                <div className="flex justify-center">
                                                    <FinalResultsTile
                                                        result={
                                                            eventData.resultFailure
                                                        }
                                                        type="failure"
                                                    ></FinalResultsTile>
                                                </div>
                                                <Button2
                                                    className="text-zinc-50 h-10"
                                                    onClick={() => navigate(-1)}
                                                >
                                                    Aceptar
                                                </Button2>
                                            </>
                                        )}
                                    {showFirstChallengeResults &&
                                        !eventResults.event
                                            .pass_first_challenge &&
                                        showDiceResults &&
                                        showSecondChallengeResults &&
                                        eventResults.event
                                            .pass_second_challenge && (
                                    <>
                                                <>
                                                <Separator
                                                    orientation="vertical"
                                                    className="w-full h-[3px] my-3"
                                                ></Separator>
                                                <div className="flex flex-col gap-2 py-4 px-44">
                                                        <p className="text-center text-2xl font-medium text-green-600">
                                                            Pasaste la 2da prueba.
                                                        🎉
                                                        </p>
                                                        <div className="grid grid-cols-3">
                                                        <CalculusColumnTable
                                                            type="Productos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .products
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEfficiencyProducts
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .products
                                                            }
                                                        ></CalculusColumnTable>
                                                        <CalculusColumnTable
                                                            type="Proyectos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .projects
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEffficiencyProjects
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .projects
                                                            }
                                                        ></CalculusColumnTable>
                                                        <CalculusColumnTable
                                                            type="Recursos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .resources
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEfficiencyResources
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .resources
                                                            }
                                                        ></CalculusColumnTable>
                                                    </div>
                                                    <div>
                                                        <TotalPointsTable
                                                            previousStrengthPoints={efficiencyPointsCalculus.previousStrengthPoints}
                                                            totalModifiersPoints={efficiencyPointsCalculus.totalModifiersPoints}
                                                            type="success"
                                                        ></TotalPointsTable>
                                                    </div>
                                                    <p className="text-center">
                                                            Tienes{" "}
                                                        <span className="font-black">
                                                            {
                                                                updatedChosenEfficiency.strength_score
                                                            }
                                                        </span>{" "}
                                                        puntos en la eficiencia{" "}
                                                        <span className="italic">{`"${updatedChosenEfficiency.title}"`}</span>
                                                        .
                                                        </p>
                                                        <p className="text-center">
                                                            Necesitabas superar los{" "}
                                                        <span className="font-black">
                                                            {
                                                                eventResults
                                                                    .event
                                                                    .risk_points
                                                            }
                                                        </span>{" "}
                                                        puntos de riesgo para
                                                        pasar y{" "}
                                                        <span className="text-green-600 font-black">
                                                            lo lograste
                                                        </span>
                                                        .
                                                        </p>
                                                    </div>
                                        {/* <Button2 className="text-zinc-50 h-10" onClick={handleEventComplete}>
                                            Aceptar
                                        </Button2> */}
                                    </>
                                    
                                                <div className="flex justify-center">
                                                    <FinalResultsTile
                                                        result={
                                                            eventData.resultSuccess
                                                        }
                                                        type="success"
                                                    ></FinalResultsTile>
                                                </div>
                                                <Button2
                                                    className="text-zinc-50 h-10"
                                                    onClick={() => navigate(-1)}
                                                >
                                                    Aceptar
                                                </Button2>
                                            </>
                                        )}
                                    {showFirstChallengeResults &&
                                        eventResults.event
                                            .pass_first_challenge &&
                                        !showDiceResults && (
                                            <>
                                                <Separator
                                                    orientation="vertical"
                                                    className="w-full h-[3px] my-3"
                                                ></Separator>
                                                <div className="flex flex-col gap-2">
                                                    <p className="text-center text-2xl font-medium text-green-600">
                                                        Pasaste la 1era prueba.
                                                        🎉
                                                    </p>
                                                    <div className="grid grid-cols-3">
                                                        <CalculusColumnTable
                                                            type="Productos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .products
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEfficiencyProducts
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .products
                                                            }
                                                        ></CalculusColumnTable>
                                                        <CalculusColumnTable
                                                            type="Proyectos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .projects
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEffficiencyProjects
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .projects
                                                            }
                                                        ></CalculusColumnTable>
                                                        <CalculusColumnTable
                                                            type="Recursos"
                                                            numberOfEnabledModifiers={
                                                                efficiencyPointsCalculus
                                                                    .profitableEfficiencyModifiers
                                                                    .resources
                                                            }
                                                            pointSystem={
                                                                pointsSystemPerEfficiencyResources
                                                            }
                                                            totalPoints={
                                                                efficiencyPointsCalculus
                                                                    .chosenEfficiencyPoints
                                                                    .resources
                                                            }
                                                        ></CalculusColumnTable>
                                                    </div>
                                                    <div>
                                                        <TotalPointsTable
                                                            previousStrengthPoints={efficiencyPointsCalculus.previousStrengthPoints}
                                                            totalModifiersPoints={efficiencyPointsCalculus.totalModifiersPoints}
                                                            type="success"
                                                        ></TotalPointsTable>
                                                    </div>
                                                    <p className="text-center">
                                                        Tienes{" "}
                                                        <span className="font-bold">
                                                            {
                                                                updatedChosenEfficiency.strength_score
                                                            }
                                                        </span>{" "}
                                                        puntos en la eficiencia{" "}
                                                        <span className="italic">{`"${updatedChosenEfficiency.title}"`}</span>
                                                        .
                                                    </p>
                                                    <p className="text-center">
                                                        Necesitabas{" "}
                                                        <span className="font-bold">
                                                            {
                                                                strengthEfficiencyPointsRequiredPerEventTable[
                                                                    eventResults
                                                                        .event
                                                                        .level
                                                                ]
                                                            }
                                                        </span>{" "}
                                                        puntos para pasar y{" "}
                                                        <span className="text-green-600 font-black">
                                                            lo lograste
                                                        </span>
                                                        .
                                                    </p>
                                                </div>
                                                <div className="flex justify-center">
                                                    <FinalResultsTile
                                                        result={
                                                            eventData.resultSuccess
                                                        }
                                                        type="success"
                                                    ></FinalResultsTile>
                                                </div>
                                                <Button2
                                                    className="text-zinc-50 h-10"
                                                    onClick={handleEventComplete}
                                                >
                                                    Aceptar
                                                </Button2>
                                            </>
                                        )}
                                    {/* {
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
                            } */}
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </AnimatePresence>
    );
}

interface ModifierEventFeatureProps extends React.HTMLProps<HTMLDivElement> {
    featureData: ModifierFeature;
    profitablePoints: number;
    alreadyAcquired: boolean;
    type?: "product" | "project" | "resource";
    enabled?: boolean;
}
export function ChallengeModifierEventFeature({
    featureData,
    profitablePoints,
    alreadyAcquired,
    type,
    enabled,
    ...rest
}: ModifierEventFeatureProps) {
    let plusPoints: string = "";
    if (type === "product") {
        if (enabled && alreadyAcquired) {
            plusPoints = "text-green-600";
        }
    } else {
        if (alreadyAcquired) {
            plusPoints = "text-green-600";
        }
    }
    //TODO: DOUBLE CHECKED ICON
    return (
        <div {...rest} className="flex gap-1 items-start font-easvhs py-1">
            <div className="w-fit relative">
                {type == "product" && alreadyAcquired && enabled && (
                    <div className="w-fit absolute inset-0 backdrop-blur-0 bg-zinc-50/80 z-10">
                        <img
                            src="/assets/icons/check.png"
                            alt="backdrop"
                            className="size-6 min-w-6"
                            title="Producto adquirido y activo"
                        />
                    </div>
                )}
                {(type == "project" || type == "resource") &&
                    alreadyAcquired && (
                        <div className="w-fit absolute inset-0 backdrop-blur-0 bg-zinc-50/80 z-10">
                            <img
                                src="/assets/icons/check.png"
                                alt="backdrop"
                                className="size-6 min-w-6"
                                title="Modificador adquirido"
                            />
                        </div>
                    )}
                <img
                    src={featureData.icon}
                    alt="Feature Icon"
                    className="size-6 min-w-6"
                    title={featureData.title}
                />
            </div>
            <div className="flex flex-col flex-grow">
                <p className="text-xs text-pretty line-clamp-2">
                    {featureData.title}
                </p>
            </div>
            <div className="w-fit min-w-10">
                <span className={twMerge("text-lg", plusPoints)}>
                    + {profitablePoints}
                </span>
            </div>
        </div>
    );
}

interface ConsequenceTileProps extends React.HTMLProps<HTMLDivElement> {
    type: "success" | "failure";
    result: ConsequenceResult;
    className?: string;
}

export function ConsequenceTile({
    type,
    result,
    className,
    ...rest
}: ConsequenceTileProps) {
    const twBorderColor =
        type === "success" ? "border-green-600" : "border-red-600";
    return (
        <div
            {...rest}
            className={twMerge(
                "flex flex-col gap-1 font-easvhs bg-zinc-50 border-[3px] border-zinc-900 p-1 rounded-sm",
                twBorderColor,
                className
            )}
        >
            <h3 className="text-center text-base">
                {type === "success" ? "Si pasas" : "Si fracasas"}
            </h3>
            <p className="text-md text-center font-rajdhani leading-tight font-semibold">
                {type === "success"
                    ? "Por la credibilidad, se te otorgará"
                    : "Se te restará"}
            </p>
            <div className="grid grid-cols-2 gap-2">
                <ConsequenceBadge
                    type={type}
                    variant="budget"
                    className="justify-center"
                >
                    {result.budget}
                </ConsequenceBadge>
                <ConsequenceBadge
                    type={type}
                    variant="score"
                    className="justify-center"
                >
                    {result.score}
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

export function FinalResultsTile({
    result,
    type,
    className,
    ...rest
}: ConsequenceTileProps) {
    const twBorderColor =
        type === "success" ? "border-green-600" : "border-red-600";
    return (
        <div
            {...rest}
            className={twMerge(
                "flex flex-col gap-1 font-easvhs bg-zinc-50 border-[3px] border-zinc-900 p-1 rounded-sm font-normal",
                twBorderColor,
                className
            )}
        >
            <h3 className="text-center text-base">
                {type === "success" ? "Pasaste" : "Fracasaste"}
            </h3>
            <p className="text-sm text-center font-rajdhani leading-tight font-semibold">
                {type === "success"
                    ? "Por la credibilidad, se te otorgará"
                    : "Se te restará"}
            </p>
            <div className="grid grid-cols-2 gap-2">
                <ConsequenceBadge
                    type={type}
                    variant="budget"
                    className="justify-center"
                >
                    {result.budget}
                </ConsequenceBadge>
                <ConsequenceBadge
                    type={type}
                    variant="score"
                    className="justify-center"
                >
                    {result.score}
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

interface CalculusColumnTableProps extends React.HTMLProps<HTMLDivElement> {
    type: "Productos" | "Proyectos" | "Recursos";
    numberOfEnabledModifiers: number;
    pointSystem: number;
    totalPoints: number;
    className?: string;
}

function CalculusColumnTable({
    type,
    pointSystem,
    numberOfEnabledModifiers,
    totalPoints,
    ...rest
}: CalculusColumnTableProps) {
    return (
        <div {...rest} className="flex flex-col gap-1 items-center">
            <p className="text-center">{type}</p>
            <div className="flex space-x-2">
                <div className="flex space-x-1">
                    <span>{numberOfEnabledModifiers}</span>
                    <img
                        src="/assets/icons/check.png"
                        alt="Check"
                        title={`Número de ${type} activados`}
                        className="size-3 min-w-3 aspect-square"
                    />
                </div>
                <p>
                    x <span className="text-green-600">{pointSystem}</span>
                </p>
            </div>
            <p className="text-center font-black">{totalPoints}</p>
        </div>
    );
}

interface TotalPointsTableProps extends React.HTMLProps<HTMLDivElement> {
    totalModifiersPoints: number;
    previousStrengthPoints: number;
    type:"success" | "failure";
    className?: string;
}

function TotalPointsTable({
    totalModifiersPoints,
    previousStrengthPoints,
    type,
    ...rest
}: TotalPointsTableProps) {
    const TotalTwColor = type === "success" ? "text-green-600" : "text-red-600";
    return (
        // <table className="max-w-[500px] min-w-[450px] table-auto" {...rest}>
        //     <thead>
        //         <tr>
        //             <th className="text-center">Total Modificadores</th>
        //             <th className="text-center">Total Eficiencia</th>
        //             <th className="text-center">Total</th>
        //         </tr>
        //     </thead>
        //     <tbody>
        //         <tr>
        //             <td className="text-center">{totalModifiersPoints}</td>
        //             <td className="text-center">{previousStrengthPoints}</td>
        //             <td className="text-center">{totalModifiersPoints + previousStrengthPoints}</td>
        //         </tr>
        //     </tbody>
        // </table>
        <div className="grid grid-cols-3" {...rest}>
            <div className="flex flex-col gap-1 items-center">
                <p className="text-center">Total Modificadores</p>
                <p className="text-center font-black">{totalModifiersPoints}</p>
            </div>
            <div className="flex flex-col gap-1 items-center">
                <p className="text-center">Total Eficiencia</p>
                <p className="text-center font-black">{previousStrengthPoints}</p>
            </div>
            <div className="flex flex-col gap-1 items-center">
                <p className="text-center">Total</p>
                <p className={twMerge("text-center font-black", TotalTwColor)}>
                    {totalModifiersPoints + previousStrengthPoints}
                </p>
            </div>
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
