import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Modal from "~/components/custom/Modal";

import { WhiteContainer } from "~/components/custom/WhiteContainer";
import { Button2 } from "~/components/custom/Button2";
import type { GameControlButton } from "~/routes/game";
import { initializedDataLoader } from "~/utils/dataLoader";
import { PlanActions } from "~/types/methods_jsons";
import { WebSocketService, getWebSocketService } from "~/services/ws";

interface ModifiersCheckout {
    products: ProductCheckoutFeature[];
    resources: ResourceCheckoutFeature[];
    projects: ProjectCheckoutFeature[];
}

interface ModifiersCheackoutFeature {
    id: string;
    title: string;
    icon: string;
}

interface ProductCheckoutFeature extends ModifiersCheackoutFeature {}

interface ResourceCheckoutFeature extends ModifiersCheackoutFeature {}

interface ProjectCheckoutFeature extends ModifiersCheackoutFeature {}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const sessionCode = url.searchParams.get("sessionCode") as string;
    const playerId = url.searchParams.get("playerId") as string;
    const globalWebSocketService = getWebSocketService(sessionCode, playerId) as WebSocketService ;
    // const { products, projects, resources} = await loadAllModifiersData();
    const { products, projects, resources} = initializedDataLoader.getAllModifiersData();

    const originalBudget = globalWebSocketService.actionPlanState.getBudget() ?? 0;
    // const originalBudget = actionPlanState.getBudget();
    let potentialRemainingBudget = globalWebSocketService.actionPlanState.getPotentialRemainingBudget();//pass to the index
    if(potentialRemainingBudget === 0) globalWebSocketService.actionPlanState.setPotentialRemainingBudget(originalBudget!);
    potentialRemainingBudget = globalWebSocketService.actionPlanState.getPotentialRemainingBudget();
    
    const submitPlan_localPlayerPlan = globalWebSocketService.submitPlan_localPlayerPlan;
    const productsCheckout = Object.values(products).filter((product) => (submitPlan_localPlayerPlan.products || []).includes(product.ID));
    const resourcesCheckout = Object.values(resources).filter((resource) => (submitPlan_localPlayerPlan.resources || []).includes(resource.ID));
    const projectsCheckout = Object.values(projects).filter((project) => (submitPlan_localPlayerPlan.projects || []).includes(project.ID));

    const totalPrice = productsCheckout.reduce((acc, product) => acc + product.cost, 0) + resourcesCheckout.reduce((acc, resource) => acc + resource.cost, 0) + projectsCheckout.reduce((acc, project) => acc + project.cost, 0);    

    return json({ productsCheckout, resourcesCheckout, projectsCheckout, totalPrice, originalBudget, submitPlan_localPlayerPlan, potentialRemainingBudget, sessionCode, playerId });
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const actionPlan = formData.get("actionPlan");
    const remainingBudget = formData.get("remainingBudget");
    const parsedActionPlan = JSON.parse(actionPlan as string) as PlanActions;

    const url = new URL(request.url);
    const sessionCode = url.searchParams.get("sessionCode") as string;
    const playerId = url.searchParams.get("playerId") as string;
    const globalWebSocketService = getWebSocketService(sessionCode, playerId) as WebSocketService ;

    globalWebSocketService.submitPlan(parsedActionPlan); //dont forget to reset the state after triggering the submit_actionplan event
    globalWebSocketService.actionPlanState.updateLocalPlayerBudget(Number(remainingBudget));
    globalWebSocketService.actionPlanState.resetPlan();
    console.log("plan recibido", actionPlan);
    console.log("Plan enviado",parsedActionPlan);
    console.log("remainingBudget", remainingBudget);
    return json({ parsedActionPlan, remainingBudget });
};

export default function ActionPlan() {
    const { productsCheckout, resourcesCheckout, projectsCheckout, totalPrice:originalTotalPrice, submitPlan_localPlayerPlan, potentialRemainingBudget, sessionCode, playerId } = useLoaderData<typeof loader>(); // Logic for discarding product must be implemented in de future

    const modifiersCheckout: ModifiersCheckout = {
        products: productsCheckout.map((product) => ({
            id: product.ID,
            title: product.name,
            icon: `/assets/modifiersIcons/products/${product.ID}.png`,
        })),
        resources: resourcesCheckout.map((resource) => ({
            id: resource.ID,
            title: resource.name,
            icon: `/assets/icons/resourcesIcon.png`,
        })),
        projects: projectsCheckout.map((project) => ({
            id: project.ID,
            title: project.name,
            icon: `/assets/icons/projectsIcon.png`,
        })),
    };

    // const [budget, setBudget] = useState(originalBudget);
    // const [totalPrice, setTotalPrice] = useState(originalTotalPrice);


    const [isModalOpen, setIsModalOpen] = useState(true);

    const navigate = useNavigate();
    const fetcher = useFetcher<typeof action>();

    useEffect(() => {
        if(fetcher.data){
            console.log("Plan enviado", fetcher.data.parsedActionPlan);
            console.log("remainingBudget", fetcher.data.remainingBudget);
            navigate(-1);
        }
    }, [fetcher.data, navigate]);

    const handleSubmit = () => {
        const actionPlan = JSON.stringify(submitPlan_localPlayerPlan);
        const remainingBudget = potentialRemainingBudget;
        fetcher.submit({ actionPlan, remainingBudget }, { method: "post" });
    }

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
    }

    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {isModalOpen && (
                <Modal title="Plan de Acción" onDismiss={handleDismiss}>
                    <div className="flex flex-col gap-2">
                        <p className="space-y-4 px-5 py-4 font-rajdhani font-semibold text-lg">
                            Ha llegado el momento de planear tu plan de acción.
                            Dale click a cada item para que puedas comprar.
                        </p>
                        <div className="flex-grow max-h-[430px]">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {actionPlanButtons.map((button) => (
                                    <WhiteContainer
                                        key={button.control}
                                        onClick={() =>
                                            navigate(`/game/action-plan/${button.control}?sessionCode=${sessionCode}&playerId=${playerId}`)
                                        }
                                        className="max-w-80 cursor-pointer hover:scale-105 transform transition-transform duration-300"
                                    >
                                        <div className="flex gap-2">
                                            <figure className="w-16 min-w-16">
                                                <img
                                                    src={button.icon}
                                                    alt="Icon"
                                                    className="object-contain aspect-square !w-16"
                                                />
                                            </figure>
                                            <div className="grow">
                                                <h4 className="text-sm font-easvhs">
                                                    {button.title}
                                                </h4>
                                                <p className="text-sm font-semibold font-rajdhani line-clamp-2" title={button.description}>
                                                    {button.description}
                                                </p>
                                            </div>
                                        </div>
                                    </WhiteContainer>
                                ))}
                            </div>
                        </div>
                        <div className="min-h-[230px] max-h-[230px] overflow-auto flex flex-col gap-2 bg-zinc-50 rounded-md p-4 border-zinc-900 border-[3px] relative">
                            <header>
                                <h4 className="font-easvhs text-lg">
                                    Resumen Modificadores a adquirir
                                </h4>
                            </header>
                            <div className="grid grid-cols-[2fr_1fr]">
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <h5 className="font-easvhs text-md mb-2">Productos</h5>
                                        <div className="flex flex-col gap-1">
                                            {modifiersCheckout.products.length>0 && modifiersCheckout.products.map(
                                                (product) => (
                                                    <div
                                                        key={product.id}
                                                        className="flex gap-2"
                                                    >
                                                        <figure className="size-6">
                                                            <img
                                                                src={product.icon}
                                                                alt="Icon"
                                                                className="object-contain aspect-square size-6"
                                                            />
                                                        </figure>
                                                        <div className="font-rajdhani leading-tight font-semibold text-base">
                                                            <p className="line-clamp-1">{product.title}</p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                            {
                                                modifiersCheckout.products.length === 0 && (
                                                    <p className="text-center font-rajdhani text-base text-gray-500">
                                                        No se han seleccionado productos
                                                    </p>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-easvhs text-md mb-2">Recursos</h5>
                                        <div className="flex flex-col gap-1">
                                            {modifiersCheckout.resources.length>0 && modifiersCheckout.resources.map(
                                                (resource) => (
                                                    <div
                                                        key={resource.id}
                                                        className="flex gap-2"
                                                    >
                                                        <figure className="size-6">
                                                            <img
                                                                src={resource.icon}
                                                                alt="Icon"
                                                                className="object-contain aspect-square size-6"
                                                            />
                                                        </figure>
                                                        <div className="font-rajdhani leading-tight font-semibold text-base">
                                                            <p className="line-clamp-1">{resource.title}</p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                            {
                                                modifiersCheckout.resources.length === 0 && (
                                                    <p className="text-center font-rajdhani text-base text-gray-500">
                                                        No se han seleccionado recursos
                                                    </p>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-easvhs text-md mb-2">Proyectos</h5>
                                        <div className="flex flex-col gap-1">
                                            {modifiersCheckout.projects.length > 0 && modifiersCheckout.projects.map(
                                                (project) => (
                                                    <div
                                                        key={project.id}
                                                        className="flex gap-2"
                                                    >
                                                        <figure className="size-6">
                                                            <img
                                                                src={project.icon}
                                                                alt="Icon"
                                                                className="object-contain aspect-square size-6"
                                                            />
                                                        </figure>
                                                        <div className="font-rajdhani leading-tight font-semibold text-base">
                                                            <p className="line-clamp-1">{project.title}</p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                            {
                                                modifiersCheckout.projects.length === 0 && (
                                                    <p className="text-center font-rajdhani text-base text-gray-500">
                                                        No se han seleccionado proyectos
                                                    </p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="border-l-[3px] border-zinc-900 px-4 flex flex-col items-center justify-between">
                                    <div className="text-center">
                                        <h5 className="font-easvhs text-md">
                                            Presupuesto restante
                                        </h5>
                                        <p className="font-easvhs text-2xl text-green-500">
                                            {potentialRemainingBudget}
                                        </p>
                                    </div>
                                    <Button2 onClick={handleSubmit}>Guardar</Button2>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </AnimatePresence>
    );
}

//Temporal Data
const actionPlanButtons = [
    {
        title: "Comprar Productos",
        icon: "/assets/icons/productsIcon.png",
        description:
            "Objetos o mejoras que, una vez adquiridos te ayudarán a ganar más puntos en futuras etapas.",
        control: "buy-products",
    },
    {
        title: "Comprar Recursos",
        icon: "/assets/icons/resourcesIcon.png",
        description: "Contrata recursos humanos que te ayuden a desarrollan productos.",
        control: "buy-resources",
    },
    {
        title: "Poner proyectos en ejecución",
        icon: "/assets/icons/projectsIcon.png",
        description: "Misiones o tareas que al pasar tres meses te otorgan productos.",
        control: "buy-projects",
    },
]; 