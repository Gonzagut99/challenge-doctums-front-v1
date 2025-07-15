import type { ActionFunctionArgs } from "@remix-run/node";
import { json, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button2 } from "~/components/custom/Button2";
import { CostButton } from "~/components/custom/CostButton";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import { getWebSocketService, WebSocketService } from "~/services/ws";
import { actionPlanState } from "~/services/ws/actionPlanState.server";
import { BuyProjectTableTileData } from "~/types/modifiers";
import { initializedDataLoader } from "~/utils/dataLoader";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // const domainProjects = await loadProjects("app/data/projects.csv");
    // const domainProducts = await loadProducts("app/data/products.csv");
    const domainProjects = initializedDataLoader.getProjects();
    const domainProducts = initializedDataLoader.getProducts();
    const projects = Object.values(domainProjects);

    const url = new URL(request.url);
    const sessionCode = url.searchParams.get("sessionCode") as string;
    const playerId = url.searchParams.get("playerId") as string;
    const globalWebSocketService = getWebSocketService(sessionCode, playerId) as WebSocketService ;

    const tileProjects: BuyProjectTableTileData[] = projects.map((project) => ({
        id: project.ID,
        title: project.name,
        icon: `/assets/icons/projectsIcon.png`,
        productDescription: "Productos a producir:",
        cost: project.cost,
        products: project.delivered_products.map((dlv) => ({
            icon: `/assets/modifiersIcons/products/${domainProducts[dlv].ID}.png`,
            id: Number(dlv),
            title: domainProducts[dlv].name,
        })),
    }));

    const potentialRemainingBudget = globalWebSocketService.actionPlanState.getPotentialRemainingBudget();
    const alreadySelectedProjects = globalWebSocketService.actionPlanState.getActionPlanSelectedProjects() || [];
    const alreadyAcquiredProjects = globalWebSocketService.actionPlanState.getAlreadyAcquiredModifiers().projects;
    const alreadyAcquiredProducts = globalWebSocketService.actionPlanState.getAlreadyAcquiredModifiers().products;

    return json({
        tileProjects,
        potentialRemainingBudget,
        alreadySelectedProjects,
        alreadyAcquiredProjects,
        alreadyAcquiredProducts,
    });
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const selectedProjects = formData.get("selectedProjects");
    const remainingBudget = formData.get("remainingBudget");
    const parsedProjects = JSON.parse(selectedProjects as string) as string[];

    const url = new URL(request.url);
    const sessionCode = url.searchParams.get("sessionCode") as string;
    const playerId = url.searchParams.get("playerId") as string;
    const globalWebSocketService = getWebSocketService(sessionCode, playerId) as WebSocketService ;

    globalWebSocketService.actionPlanState.updateProjectPlan(parsedProjects); //dont forget to reset the state after triggering the submit_actionplan event
    globalWebSocketService.actionPlanState.updateBudget(Number(remainingBudget));
    console.log("selectedProjects", selectedProjects);
    console.log(parsedProjects);
    console.log("remainingBudget", remainingBudget);
    return json({ parsedProjects, remainingBudget });
};

const calculateTotalCost = ( selectedProjects: string[], tileProducts:BuyProjectTableTileData[]) => {
    const total = selectedProjects.reduce(
        (acc, projectId) =>
            acc +
            (tileProducts.find((project) => project.id === projectId)?.cost || 0),
        0
    );
    return total;
}

export default function BuyProjects() {
    const { alreadyAcquiredProjects, tileProjects, alreadySelectedProjects, potentialRemainingBudget, alreadyAcquiredProducts } = useLoaderData<typeof loader>();
    const maxProjectsPerMonth = 1;

    const [previousTotal, setPreviousTotal] = useState(calculateTotalCost(alreadySelectedProjects, tileProjects));
    const [totalCost, setTotalCost] = useState<number>(calculateTotalCost(alreadySelectedProjects, tileProjects));
    const [selectedProjects, setSelectedProjects] = useState<string[]>(alreadySelectedProjects);
    const [potentialRemainingBudgetState, setPotentialRemainingBudgetState] = useState(potentialRemainingBudget);

    const [isModalOpen, setIsModalOpen] = useState(true);

    const surpassMaxProjects = selectedProjects.length > maxProjectsPerMonth;
    const surpassBudget = totalCost > potentialRemainingBudgetState;

    const fetcher = useFetcher();
    const navigate = useNavigate();

    useEffect(() => {
        if (fetcher.data) {
            console.log(fetcher.data);
            navigate(-1);
        }
    }, [fetcher.data, navigate]);

    // Calculate totalCost and remainingBudget whenever selectedProjects changes
    useEffect(() => {
        const total = calculateTotalCost(selectedProjects, tileProjects);
        setTotalCost(total);

        const updateDifference = previousTotal-total;
        const update_remainingBudget = potentialRemainingBudgetState + updateDifference;
        setPotentialRemainingBudgetState(update_remainingBudget);

        setPreviousTotal(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProjects, tileProjects]);

    const handleSubmit = () => {
        const data = JSON.stringify(selectedProjects);
        const formData = new FormData();
        formData.append("selectedProjects", data);
        formData.append("remainingBudget", potentialRemainingBudgetState.toString());
        fetcher.submit(formData, {
            method: "post",
        });
    };

    const handleSelectProject = (projectId: string) => {
        setSelectedProjects((prevSelected) => {
            if (prevSelected.includes(projectId)) {
                return prevSelected.filter((id) => id !== projectId);
            } else {
                return [...prevSelected, projectId];
            }
        });
    };

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
    }
    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {isModalOpen && (
                <Modal
                    type="back"
                    title="Pon proyectos en ejecución"
                    onDismiss={handleDismiss}
                >
                    <div className="flex flex-col gap-2">
                        <p className="space-y-4 px-5 py-4 font-rajdhani font-semibold leading-tight text-lg">
                            Misiones o tareas que al pasar tres meses te otorgan
                            productos.
                            {"\n"}
                            {`Solo puedes comprar ${maxProjectsPerMonth} productos por mes.`}
                        </p>
                        <div className="flex-grow max-h-[410px] overflow-y-auto scrollbar-thin flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-2">
                                {tileProjects.map((project) => {
                                    const alreadyAcquiredIds =
                                        alreadyAcquiredProjects.map(
                                            (project) => project.id
                                        );
                                    const alreadyAcquired = alreadyAcquiredIds.includes(
                                        project.id
                                    );
                                    const alreadyAcquiredProductsIds = alreadyAcquiredProducts.map(
                                        (product) => product.id
                                    );
                                    return (
                                        <ModifierTabletTile
                                            key={project.title}
                                            tabletTileData={project}
                                            alreadyAcquiredProducts={alreadyAcquiredProductsIds}
                                            // className="max-h-[110px]"
                                        >   {(alreadyAcquired) && (
                                                <div className="w-fit">
                                                    <img
                                                        src="/assets/icons/check.png"
                                                        alt="selected modifier"
                                                        className="size-6"
                                                    />
                                                </div>
                                                )
                                            }

                                            {
                                                (selectedProjects.includes( project.id )) && (
                                                    <div className="w-fit">
                                                        <img
                                                            src="/assets/icons/check.png"
                                                            alt="selected modifier"
                                                            className="size-6"
                                                        />
                                                    </div>
                                                )
                                            }
                                            {/* <button
                                                className="flex items-center gap-2 border-2 border-zinc-900 bg-[#99C579] px-2 disabled:opacity-50"
                                                onClick={() =>
                                                    handleSelectProject(
                                                        project.id
                                                    )
                                                }
                                                disabled={alreadyAcquired}
                                                title={
                                                    alreadyAcquired
                                                        ? "Ya tienes este projecto en ejecución"
                                                        : "Aún no tienes este projecto"
                                                }
                                            >
                                                <figure
                                                    className={
                                                        "px-1 h-full flex items-center w-fit"
                                                    }
                                                >
                                                    <img
                                                        src="/assets/icons/cashIcon.png"
                                                        alt="Icon"
                                                        className="size-6"
                                                    />
                                                </figure>
                                                <span className="font-easvhs text-lg">
                                                    {project.cost}
                                                </span>
                                            </button> */}
                                            <CostButton
                                                alreadyAcquired={alreadyAcquired}
                                                product={{ id: project.id, cost: project.cost }}
                                                handleSelectProduct={handleSelectProject}
                                                modifierType="projects"
                                            >
                                            </CostButton>
                                            {/* <span className="text-green-500">
                                                    {product.cost}
                                            </span> */}
                                        </ModifierTabletTile>
                                    );
                                })}
                            </div>
                            <div className="flex justify-end">
                                <div className=" max-w-[400px] flex flex-col gap-2 items-end">
                                    <div className="flex gap-2 w-fit">
                                        <span className="font-easvhs text-lg">
                                            Total de projectos:
                                        </span>
                                        <span className="font-easvhs text-lg text-red-500">
                                            {selectedProjects.length}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 w-fit">
                                        <span className="font-easvhs text-lg">
                                            Presupuesto restante:
                                        </span>
                                        <span
                                            className={twMerge(
                                                "font-easvhs text-lg",
                                                surpassBudget &&
                                                    "text-red-500"
                                            )}
                                        >
                                            {potentialRemainingBudgetState}
                                        </span>
                                    </div>
                                    <p
                                        className={twMerge(
                                            "font-rajdhani font-semibold text-sm text-red-500",
                                            !surpassMaxProjects && "hidden"
                                        )}
                                    >
                                        {`Solo puedes comprar ${maxProjectsPerMonth} proyecto por mes`}
                                    </p>
                                    <p
                                        className={twMerge(
                                            "font-rajdhani font-semibold text-sm text-red-500",
                                            !surpassBudget && "hidden"
                                        )}
                                    >
                                        {`Tu presupuesto no es suficiente`}
                                    </p>
                                    <Button2
                                        onClick={handleSubmit}
                                        disabled={
                                            surpassMaxProjects || surpassBudget
                                        }
                                    >
                                        Guardar
                                    </Button2>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </AnimatePresence>
    );
} 