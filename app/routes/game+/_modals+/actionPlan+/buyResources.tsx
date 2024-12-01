import type { ActionFunctionArgs } from "@remix-run/node";
import { json, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button2 } from "~/components/custom/Button2";
import { CostButton } from "~/components/custom/CostButton";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import { actionPlanState } from "~/services/ws/actionPlanState.server";
import { BuyResourceTableTileData } from "~/types/modifiers";
import { loadProducts, loadResources, productsData, resourcesData } from "~/utils/dataLoader";

export const loader = async () => {
    const domainResources = resourcesData;
    const domainProducts = productsData;
    const resources = Object.values(domainResources);

    const tileResources: BuyResourceTableTileData[] = resources.map(
        (resource) => ({
            id: resource.ID,
            title: resource.name,
            icon: `/assets/icons/projectsIcon.png`,
            productDescription: "Productos a desarrollar:",
            cost: resource.cost,
            products: resource.developed_products.map((dlv) => ({
                icon: `/assets/modifiersIcons/products/${domainProducts[dlv].ID}.png`,
                id: Number(dlv),
                title: domainProducts[dlv].name,
            })),
        })
    );

    const potentialRemainingBudget = actionPlanState.getPotentialRemainingBudget();
    const alreadySelectedResources = actionPlanState.getActionPlanSelectedResources() || [];
    const alreadyAcquiredResources =
        actionPlanState.getAlreadyAcquiredModifiers().resources;
    const alreadyAcquiredProducts = actionPlanState.getAlreadyAcquiredModifiers().products;

    return json({
        tileResources,
        potentialRemainingBudget,
        alreadySelectedResources,
        alreadyAcquiredResources,
        alreadyAcquiredProducts,
    });
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const selectedResources = formData.get("selectedResources");
    const remainingBudget = formData.get("remainingBudget");
    const parsedResources = JSON.parse(selectedResources as string) as string[];

    actionPlanState.updateResourcesPlan(parsedResources); //dont forget to reset the state after triggering the submit_actionplan event
    actionPlanState.updateBudget(Number(remainingBudget));
    console.log("selectedProducts", selectedResources);
    console.log(parsedResources);
    console.log("remainingBudget", remainingBudget);
    return json({ parsedResources, remainingBudget });
};

const calculateTotalCost = ( selectedResources: string[], tileResources:BuyResourceTableTileData[]) => {
    const total = selectedResources.reduce(
        (acc, projectId) =>
            acc +
            (tileResources.find((project) => project.id === projectId)?.cost || 0),
        0
    );
    return total;
}

export default function BuyResources() {
    const { alreadyAcquiredResources, alreadySelectedResources, potentialRemainingBudget, tileResources, alreadyAcquiredProducts } = useLoaderData<typeof loader>();
    const maxResourcesPerMonth = 1;

    const [previousTotal, setPreviousTotal] = useState(calculateTotalCost(alreadySelectedResources, tileResources));
    const [totalCost, setTotalCost] = useState<number>(calculateTotalCost(alreadySelectedResources, tileResources));
    const [selectedResources, setSelectedResources] = useState<string[]>(alreadySelectedResources);
    const [potentialRemainingBudgetState, setPotentialRemainingBudgetState] = useState(potentialRemainingBudget);

    const [isModalOpen, setIsModalOpen] = useState(true);

    const surpassMaxResources = selectedResources.length > maxResourcesPerMonth;
    const surpassBudget = totalCost > potentialRemainingBudgetState;

    const fetcher = useFetcher();
    const navigate = useNavigate();

    useEffect(() => {
        if (fetcher.data) {
            console.log(fetcher.data);
            navigate(-1);
        }
    }, [fetcher.data, navigate]);

    // Calculate totalCost and remainingBudget whenever selectedResources changes
    useEffect(() => {
        const total = calculateTotalCost(selectedResources, tileResources);
        setTotalCost(total);

        const updateDifference = previousTotal-total;
        const update_remainingBudget = potentialRemainingBudgetState + updateDifference;
        setPotentialRemainingBudgetState(update_remainingBudget);

        setPreviousTotal(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedResources, tileResources]);

    const handleSubmit = () => {
        const data = JSON.stringify(selectedResources);
        const formData = new FormData();
        formData.append("selectedResources", data);
        formData.append("remainingBudget", potentialRemainingBudgetState.toString());
        fetcher.submit(formData, {
            method: "post",
        });
    };

    const handleSelectResources = (resourceId: string) => {
        setSelectedResources((prevSelected) => {
            if (prevSelected.includes(resourceId)) {
                return prevSelected.filter((id) => id !== resourceId);
            } else {
                return [...prevSelected, resourceId];
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
                    title="Compra recursos"
                    onDismiss={handleDismiss}
                >
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="space-y-2 px-5 py-4 font-rajdhani font-semibold text-lg leading-tight">
                                Contrata recursos humanos que te ayuden a
                                desarrollan productos.
                            </p>
                            <div className="px-11">
                                <div className="border-[3px] border-zinc-900 bg-[#FFE96F] rounded-md font-rajdhani font-semibold text-lg px-3 py-2 flex gap-2 items-center leading-tight">
                                    <img
                                        src="/assets/icons/warningIcon.png"
                                        alt="WarningIcon"
                                    />
                                    <p className="text-center">
                                        {`Solo puedes contratar ${maxResourcesPerMonth} recurso por mes. `}
                                        Por cada recurso contratado tendras que
                                        pagar mensualmente 250 en salarios.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow max-h-[360px] overflow-y-auto scrollbar-thin flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-2">
                                {tileResources.map((resource) => {
                                    const alreadyAcquiredIds =
                                        alreadyAcquiredResources.map(
                                            (resource) => resource.id
                                        );
                                    const alreadyAcquired = alreadyAcquiredIds.includes(
                                        resource.id
                                    );
                                    const alreadyAcquiredProductsIds = alreadyAcquiredProducts.map(
                                            (product) => product.id
                                        );
                                    return (
                                        <ModifierTabletTile
                                            key={resource.title}
                                            tabletTileData={resource}
                                            alreadyAcquiredProducts={alreadyAcquiredProductsIds}
                                            // className="max-h-[110px]"
                                        >
                                            {(alreadyAcquired) && (
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
                                                (selectedResources.includes( resource.id )) && (
                                                    <div className="w-fit">
                                                        <img
                                                            src="/assets/icons/check.png"
                                                            alt="selected modifier"
                                                            className="size-6"
                                                        />
                                                    </div>
                                                )
                                            }
                                            {/* <button className="flex items-center gap-2 border-2 border-zinc-900 bg-[#99C579] px-2 disabled:opacity-50" onClick={() =>
                                                    handleSelectResources(
                                                        resource.id
                                                    )
                                                } disabled={alreadyAcquired}
                                                title={
                                                    alreadyAcquired
                                                        ? "Ya contrataste este recurso humano"
                                                        : "Aún no contrataste este recurso humano"
                                                }>
                                                
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
                                                    {resource.cost}
                                                </span>
                                            </button> */}
                                            <CostButton
                                                alreadyAcquired={alreadyAcquired}
                                                product={{ id: resource.id, cost: resource.cost }}
                                                handleSelectProduct={handleSelectResources}
                                                modifierType="resources"
                                            ></CostButton>
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
                                            Total de recursos:
                                        </span>
                                        <span
                                            className={twMerge(
                                                "font-easvhs text-xl",
                                                surpassMaxResources
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            )}
                                        >
                                            {selectedResources.length}/ max(
                                            {maxResourcesPerMonth})
                                        </span>
                                    </div>
                                    <div className="flex gap-2 w-fit">
                                        <span className="font-easvhs text-xl">
                                            Presupuesto restante:
                                        </span>
                                        <div className="flex items-center gap-2 border-2 border-zinc-900 bg-zinc-300 px-2">
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
                                                {potentialRemainingBudgetState}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-fit">
                                        <span className="font-easvhs text-2xl">
                                            Total:
                                        </span>
                                        <div className="flex items-center gap-2 border-2 border-zinc-900 bg-[#99C579] px-2">
                                            <figure
                                                className={
                                                    "px-1 h-full flex items-center w-fit"
                                                }
                                            >
                                                <img
                                                    src="/assets/icons/cashIcon.png"
                                                    alt="Icon"
                                                    className="size-8"
                                                />
                                            </figure>
                                            <span className="font-easvhs text-xl">
                                                {totalCost}
                                            </span>
                                        </div>
                                    </div>
                                    <Button2
                                        className="btn btn-primary font-easvhs text-zinc-50 text-xl w-80 disabled:opacity-50 max-w-80 !max-h-14"
                                        onClick={handleSubmit}
                                        disabled={
                                            surpassBudget || surpassMaxResources
                                        }
                                    >
                                        Enviar
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
