// import type { LoaderFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import { getWebSocketService, WebSocketService } from "~/services/ws";
import { ModifiersTabletTileData } from "~/types/modifiers";
import { initializedDataLoader } from "~/utils/dataLoader";

interface MyProjectsTileData {
    remainingMonths: number;
    generalData: ModifiersTabletTileData;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const sessionCode = url.searchParams.get("sessionCode") as string;
    const playerId = url.searchParams.get("playerId") as string;
    const globalWebSocketService = getWebSocketService(sessionCode, playerId) as WebSocketService ;
    
    // const domainProjectsObject = await loadProjects("app/data/projects.csv");
    // const domainProductsObject = await loadProducts("app/data/products.csv");
    const domainProjectsObject = initializedDataLoader.getProjects();
    const domainProductsObject = initializedDataLoader.getProducts();
    const domainProjectsValues = Object.values(domainProjectsObject)
    // let myProjects = globalWebSocketService.localPlayerModifiers.projects;
    const myProducts = globalWebSocketService.localPlayerModifiers.products ?? [];
    const alreadyAcquiredProductsIds: string[] = myProducts.length > 0 ? myProducts.map((product) => product.id) : [];

    // myProducts = Object.values(domainProductsObject).map((product) => ({
    //     id: product.ID,
    //     is_enabled: false,
    //     was_bought: false,
    //     purchased_requirements: product.requirements,
    // }));

    const myProjectsTileData: MyProjectsTileData[] = domainProjectsValues.map((project) => ({
        remainingMonths: 0,
        generalData: {
            id: project.ID,
            title: domainProjectsObject[project.ID].name,
            icon: `/assets/icons/projectsIcon.png`,
            productDescription: "Productos a producir:",
            products: domainProjectsObject[project.ID].delivered_products.map(
                (product) => ({
                    icon: `/assets/modifiersIcons/products/${product}.png`,
                    id: Number(product),
                    title: domainProductsObject[product].name,
                })
            ),
        },
    }));

    return json({
        myProjectsTileData,
        alreadyAcquiredProductsIds,
        domainProjectsObject,
    });
};

export default function MyProjects() {
    const { myProjectsTileData: myProjects, alreadyAcquiredProductsIds, domainProjectsObject } =
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
                <Modal title="Catálogo de proyectos" type="back" onDismiss={handleDismiss}>
                    <div className="flex flex-col gap-2 max-h-[500px] overflow-auto scrollbar-thin">
                        <p className="space-y-4 px-5 py-4 font-rajdhani font-semibold leading-snug text-lg">
                            Los proyectos te ayudarán a desarrollar tu empresa pues te brindan una producción alta de productos despues de 3 meses de ejecución.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {myProjects.length > 0 &&
                                myProjects.map((project) => {
                                    // const monthsCompleted =
                                    //     maxMonths - project.remainingMonths;
                                    // const waitingMonthsCompletedClass =
                                    //     monthsCompleted === maxMonths
                                    //         ? "text-green-500"
                                    //         : "";
                                    return (
                                        <ModifierTabletTile
                                            key={project.generalData.title}
                                            tabletTileData={project.generalData}
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
                                                    {domainProjectsObject[project.generalData.id].cost}
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
