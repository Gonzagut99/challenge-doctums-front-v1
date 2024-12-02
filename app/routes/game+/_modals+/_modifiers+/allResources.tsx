// import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import { globalWebSocketService } from "~/services/ws";
import { ModifiersTabletTileData } from "~/types/modifiers";
import { initializedDataLoader } from "~/utils/dataLoader";

interface MyResourcesTileData {
    remainingMonths: number;
    generalData: ModifiersTabletTileData;
}

export const loader = async () => {
    // const domainResourcesObject = await loadResources("app/data/resources.csv");
    // const domainProductsObject = await loadProducts("app/data/products.csv");
    const domainResourcesObject = initializedDataLoader.getResources();
    const domainProductsObject = initializedDataLoader.getProducts();
    const domainResourcesValues = Object.values(domainResourcesObject)
    // let myProjects = globalWebSocketService.localPlayerModifiers.projects;
    const myProducts = globalWebSocketService.localPlayerModifiers.products ?? [];
    const alreadyAcquiredProductsIds: string[] = myProducts.length > 0 ? myProducts.map((product) => product.id) : [];

    // myProducts = Object.values(domainProductsObject).map((product) => ({
    //     id: product.ID,
    //     is_enabled: false,
    //     was_bought: false,
    //     purchased_requirements: product.requirements,
    // }));

    const myResourcesTileData: MyResourcesTileData[] = domainResourcesValues.map((project) => ({
        remainingMonths: 0,
        generalData: {
            id: project.ID,
            title: domainResourcesObject[project.ID].name,
            icon: `/assets/icons/projectsIcon.png`,
            productDescription: "Productos a producir:",
            products: domainResourcesObject[project.ID].developed_products.map(
                (product) => ({
                    icon: `/assets/modifiersIcons/products/${product}.png`,
                    id: Number(product),
                    title: domainProductsObject[product].name,
                })
            ),
        },
    }));

    return json({
        myResourcesTileData,
        alreadyAcquiredProductsIds,
        domainResourcesObject,
    });
};

export default function MyResources() {
    const { myResourcesTileData: myResources, alreadyAcquiredProductsIds, domainResourcesObject } =
        useLoaderData<typeof loader>();
    // const maxMonths = 3;
    const [isModalOpen, setIsModalOpen] = useState(true);

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
                <Modal title="Ctálogo de recursos" type="back" onDismiss={handleDismiss}>
                    <div className="flex flex-col gap-2 max-h-[500px] overflow-auto scrollbar-thin">
                        <p className="space-y-4 px-5 py-4 font-rajdhani font-semibold leading-snug text-lg">
                            Contratando recursos humanos tienes la garantía de la producción de productos despues del primer mes de contratación.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {myResources.length > 0 &&
                                myResources.map((resource) => {
                                    // const monthsCompleted =
                                    //     maxMonths - project.remainingMonths;
                                    // const waitingMonthsCompletedClass =
                                    //     monthsCompleted === maxMonths
                                    //         ? "text-green-500"
                                    //         : "";
                                    return (
                                        <ModifierTabletTile
                                            key={resource.generalData.title}
                                            tabletTileData={resource.generalData}
                                            alreadyAcquiredProducts={
                                                alreadyAcquiredProductsIds ?? []
                                            }
                                        >
                                             <button
                                                className="flex items-center gap-2 border-2 border-zinc-900 bg-[#99C579] px-2 disabled:opacity-80"
                                                // onClick={() =>
                                                //     handleSelectProject(
                                                //         project.id
                                                //     )
                                                // }
                                                disabled
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
                                                    {domainResourcesObject[resource.generalData.id].cost}
                                                </span>
                                            </button>
                                        </ModifierTabletTile>
                                    );
                                })}
                        </div>
                    </div>
                </Modal>
            )}
        </AnimatePresence>
    );
}
