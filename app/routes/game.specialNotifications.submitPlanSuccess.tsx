// import type { LoaderFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ConsequenceBadge } from "~/components/custom/ConsequenceBadge";
import {
    ModifiersSmallTile,
    ProductTileData,
    ProjectTileData,
    ResourceTileData,
} from "~/components/custom/ModifiersSmallTile";
import SmallModal from "~/components/custom/SmallModal";
import { getWebSocketService, WebSocketService } from "~/services/ws";
import { initializedDataLoader } from "~/utils/dataLoader";

// export type ActionPlanPlayerState = {
//     budget: number;
//     products: [{
//         product_id: string;
//         is_enabled: boolean;
//         purchased_requirements: string[];
//     }];
//     projects:[{
//         project_id: string;
//         remaining_time: number;
//     }];
//     resources:[{
//         resource_id: string;
//         remaining_time: number;
//     }];
// }

// type ProductTileData = {
//     product_id: string;
//     title: string;
//     is_enabled: boolean;
//     purchased_requirements: [{
//         id: string;
//         title: string;
//         src: string;
//     }];
// }

// type ProjectTileData = {
//     project_id: string;
//     title: string;
//     remaining_time: number;
// }

// type ResourceTileData = {
//     resource_id: string;
//     title: string;
//     remaining_time: number;
// }

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const sessionCode = url.searchParams.get("sessionCode") as string;
    const playerId = url.searchParams.get("playerId") as string;
    const globalWebSocketService = getWebSocketService(sessionCode, playerId) as WebSocketService ;
    // const { products, projects, resources } = await loadAllModifiersData();
    const { products, projects, resources } = initializedDataLoader.getAllModifiersData();
    const currentLocalPlayerData =
        globalWebSocketService.getLocalPlayerDynamicInfo();
    const submitPlanResponse = globalWebSocketService.getSubmitPlanEffects();
    const productTileData: ProductTileData[] =
        submitPlanResponse.player.products.map((product:{
            product_id: string;
            is_enabled: boolean;
            purchased_requirements: string[];
        }) => {
            const { product_id, is_enabled, purchased_requirements } = product;
            const productInfo = products[product_id];
            const allRequirements = productInfo.requirements
            return {
                product_id,
                src: `/assets/modifiersIcons/products/${product_id}.png`,
                is_enabled,
                // purchased_requirements: purchased_requirements.map((requirement) => {
                //     const reqObject = Object.values(products).find(
                //         (product) => product.ID === requirement
                //     );
                //     return {
                //         id:requirement,
                //         title: reqObject?.name || "",
                //         src: `/assets/modifiersIcons/products/${requirement}.png`,
                //     };
                // }
                // ),
                purchased_requirements: purchased_requirements,
                all_requirements: allRequirements.map((product) => ({
                    id: products[product].ID,
                    title: products[product].name,
                    src: `/assets/modifiersIcons/products/${product}.png`,
                })),
                title:
                    Object.values(products).find(
                        (product) => product.ID === product_id
                    )?.name || "",
            };
        });
    const projectTileData: ProjectTileData[] =
        submitPlanResponse.player.projects.map((project:{
            project_id: string;
            remaining_time: number;
        }) => {
            const { project_id, remaining_time } = project;
            return {
                project_id,
                remaining_time,
                title:
                    Object.values(projects).find(
                        (project) => project.ID === project_id
                    )?.name || "",
            };
        });
    const resourceTileData: ResourceTileData[] =
        submitPlanResponse.player.resources.map((resource:{
            resource_id: string;
            remaining_time: number;
        }) => {
            const { resource_id, remaining_time } = resource;
            return {
                resource_id,
                remaining_time,
                title:
                    Object.values(resources).find(
                        (resource) => resource.ID === resource_id
                    )?.name || "",
            };
        });

    return json({
        currentLocalPlayerData,
        submitPlanResponse,
        productTileData,
        projectTileData,
        resourceTileData,
    });
};

export default function WidgetDetailRoute() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const navigate = useNavigate();

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
    }

    const { currentLocalPlayerData,productTileData, projectTileData, resourceTileData } =
        useLoaderData<typeof loader>();

    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {isModalOpen && (
                <SmallModal onDismiss={handleDismiss} className="w-[500px] h-[500px] py-2">
                    <div className="flex flex-col px-2 w-full space-y-2">
                    <h1 className="text-2xl font-easvhs flex gap-2 justify-center">
                        ¡Compra exitosa!
                        <span>
                            <img
                                className="size-7"
                                src="/assets/icons/celebrationIcon.png"
                                alt="Celebrate"
                            />
                        </span>
                    </h1>
                    <div className="flex flex-col gap-1 items-center">
                        <p className="text-lg font-easvhs">
                            Ahora tienes estos modificadores
                        </p>
                        <p className="text-sm font-rajdhani font-semibold">
                            Tus productos activados te ayudarán a pasar eventos.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 justify-center">
                            <ConsequenceBadge type="success" variant="budget">
                                <span>{currentLocalPlayerData?.budget}</span>
                            </ConsequenceBadge>
                            <ConsequenceBadge type="success" variant="score">
                                <span>{currentLocalPlayerData?.score}</span>
                            </ConsequenceBadge>
                        </div>
                        <div className="flex flex-col gap-2 h-[260px] max-h-[260px] overflow-auto scrollbar-thin">
                            {productTileData.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-easvhs">
                                        Lista actualizada de productos
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        {productTileData.map((product) => (
                                            <ModifiersSmallTile
                                                key={product.product_id}
                                                modifierTileData={product}
                                                type="product"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {projectTileData.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-easvhs">
                                        Lista actualizada de proyectos
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        {projectTileData.map((project) => (
                                            <ModifiersSmallTile
                                                key={project.project_id}
                                                modifierTileData={project}
                                                type="project"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {resourceTileData.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-easvhs">
                                        Lista actualizada de recursos
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        {resourceTileData.map((resource) => (
                                            <ModifiersSmallTile
                                                key={resource.resource_id}
                                                modifierTileData={resource}
                                                type="resource"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    </div>
                </SmallModal>
            )}
        </AnimatePresence>
    );
}
