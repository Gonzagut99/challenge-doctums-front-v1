// import type { LoaderFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button2 } from "~/components/custom/Button2";
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

    //const domainProductsValues = Object.values(domainProductsObject)
    let myProjects = globalWebSocketService.localPlayerModifiers.projects;
    let myProducts = globalWebSocketService.localPlayerModifiers.products;
    let myProjectsTileData: MyProjectsTileData[];
    let alreadyAcquiredProductsIds: string[];

    // let productsTabletTileData: MyProductTableTileData[];
    if (myProjects.length > 0) {
        myProjectsTileData = myProjects.map((project) => ({
            remainingMonths: project.remaining_time ?? 0,
            generalData: {
                id: project.id,
                title: domainProjectsObject[project.id].name,
                icon: `/assets/icons/projectsIcon.png`,
                productDescription: "Productos a producir:",
                products: domainProjectsObject[
                    project.id
                ].delivered_products.map((product) => ({
                    icon: `/assets/modifiersIcons/products/${product}.png`,
                    id: Number(product),
                    title: domainProductsObject[product].name,
                })),
            },
        }));
        alreadyAcquiredProductsIds = myProducts.map((product) => product.id);
    } else {
        myProjects = [];
        myProducts = [];
        myProjectsTileData = [];
        alreadyAcquiredProductsIds = [];
    }

    return json({
        myProjectsTileData,
        alreadyAcquiredProductsIds,
        sessionCode,
        playerId,

    });

    // const domainProjectsValues = Object.values(domainProjectsObject);
    //let myProjects = globalWebSocketService.localPlayerModifiers.projects;
    // if (myProjects.length===0) {
    //     myProjects = Object.values(await loadProjects("app/data/projects.csv")).map((project) => ({
    //         id: project.ID,
    //         remaining_time: 3,
    //     }));
    // }
    //let myProducts = globalWebSocketService.localPlayerModifiers.products;
    // if (myProducts.length===0) {
    //     myProducts = Object.values(domainProductsObject).map((product) => ({
    //         id: product.ID,
    //         is_enabled: false,
    //         was_bought: false,
    //         purchased_requirements: product.requirements,
    //     }));
    // }
    // const myProjectsTileData: MyProjectsTileData[] = myProjects.map((project) => ({
    //     remainingMonths: project.remaining_time ?? 0,
    //     generalData: {
    //         id: project.id,
    //         title: domainProjectsObject[project.id].name,
    //         icon: `/assets/icons/projectsIcon.png`,
    //         productDescription: "Productos a producir:",
    //         products: domainProjectsObject[project.id].delivered_products.map((product) => ({
    //             icon: `/assets/modifiersIcons/products/${product}.png`,
    //             id: Number(product),
    //             title: domainProductsObject[product].name,
    //         })),
    //     }
    // }));
    // alreadyAcquiredProductsIds = myProducts.map((product) => product.id);
    //   return json({ myProjectsTileData, alreadyAcquiredProductsIds });
};

export default function MyProjects() {
    const { myProjectsTileData: myProjects, alreadyAcquiredProductsIds, sessionCode, playerId } =
        useLoaderData<typeof loader>();
    const maxMonths = 3;
    const [isModalOpen, setIsModalOpen] = useState(true);

    const navigate = useNavigate();

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
    }
    function goToProjectCatalogue() {
        navigate(`/game/allProjects?sessionCode=${sessionCode}&playerId=${playerId}`);
    }
    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {isModalOpen && (
                <Modal
                    title="Tus proyectos"
                    onDismiss={handleDismiss}
                    className="h-full pb-10"
                >
                    {myProjects.length > 0 &&
                        alreadyAcquiredProductsIds.length > 0 && (
                            <div className="flex flex-col gap-2 h-full">
                                <p className="space-y-4 px-5 py-4 font-rajdhani font-semibold leading-snug text-lg">
                                    Objetos o mejoras que, una vez adquiridos te
                                    ayudarán a ganar más puntos en futuras etapa
                                </p>
                                <div className="grid grid-cols-2 gap-2 overflow-auto scrollbar-thin">
                                    {myProjects.length > 0 &&
                                        myProjects.map((project) => {
                                            const monthsCompleted =
                                                maxMonths -
                                                project.remainingMonths;
                                            const waitingMonthsCompletedClass =
                                                monthsCompleted === maxMonths
                                                    ? "text-green-500"
                                                    : "";
                                            return (
                                                <ModifierTabletTile
                                                    key={
                                                        project.generalData
                                                            .title
                                                    }
                                                    tabletTileData={
                                                        project.generalData
                                                    }
                                                    alreadyAcquiredProducts={
                                                        alreadyAcquiredProductsIds ??
                                                        []
                                                    }
                                                >
                                                    <span
                                                        className={twMerge(
                                                            "font-dogica-bold text-lg",
                                                            waitingMonthsCompletedClass
                                                        )}
                                                    >
                                                        {monthsCompleted}/
                                                        {maxMonths}
                                                    </span>
                                                </ModifierTabletTile>
                                            );
                                        })}
                                    {/* {
                            myProjects.length === 0 && (
                                <div className="text-[12px] font-easvhs opacity-50 pt-2 text-center">No cuentas con ningun proyecto ejecutándose aún</div>
                            )
                        } */}
                                </div>
                                <div className="flex justify-center flex-grow items-center">
                                    <Button2
                                        onClick={goToProjectCatalogue}
                                        className="px-4 h-fit text-zinc-50 font-easvhs py-4"
                                    >
                                        Ver catálogo de proyectos
                                    </Button2>
                                </div>
                            </div>
                        )}
                         {
                            myProjects.length === 0 &&
                            alreadyAcquiredProductsIds.length === 0 && (
                                <div className="flex justify-center items-center flex-col h-full w-full">
                                    <p className="space-y-4 px-5 py-4 text-lg opacity-50 pt-2 text-center font-rajdhani leading-tight font-semibold">
                                        No cuentas con ningun proyecto aún.
                                    </p>
                                    <Button2 onClick={goToProjectCatalogue} className="px-4 h-fit text-zinc-50 font-easvhs py-4">Ver catálogo de proyectos</Button2>
                                </div>
                            )
                        }
                </Modal>
            )}
        </AnimatePresence>
    );
}
// const myProjects: MyProjectsTileData[] = [
//     {
//         remainingMonths: 3,
//         generalData: {
//             title: "Implementacion de la solucion",
//             icon: "/assets/icons/projectsIcon.png",
//             productDescription: "Productos a producir:",
//             products: [
//                 {
//                     icon: "/assets/modifiersIcons/products/40.png",
//                     id: 40,
//                     title: "Implementacion de la solucion"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/16.png",
//                     id: 16,
//                     title: "Implementacion de la solucion"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/21.png",
//                     id: 21,
//                     title: "Implementacion de la solucion"
//                 }
//             ]
//         }
//     },
//     {
//         remainingMonths: 2,
//         generalData: {
//             title: "Alineacion Estrategica",
//             icon: "/assets/icons/projectsIcon.png",
//             productDescription: "Productos a producir:",
//             products: [
//                 {
//                     icon: "/assets/modifiersIcons/products/5.png",
//                     id: 5,
//                     title: "Alineacion Estrategica"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/46.png",
//                     id: 46,
//                     title: "Alineacion Estrategica"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/30.png",
//                     id: 30,
//                     title: "Alineacion Estrategica"
//                 }
//             ]
//         }
//     },
//     {
//         remainingMonths: 1,
//         generalData: {
//             title: "Gestion del cambio",
//             icon: "/assets/icons/projectsIcon.png",
//             productDescription: "Productos a producir:",
//             products: [
//                 {
//                     icon: "/assets/modifiersIcons/products/12.png",
//                     id: 12,
//                     title: "Gestion del cambio"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/24.png",
//                     id: 24,
//                     title: "Gestion del cambio"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/39.png",
//                     id: 39,
//                     title: "Gestion del cambio"
//                 }
//             ]
//         }
//     },
//     {
//         remainingMonths: 0,
//         generalData: {
//             title: "Reorganizacion",
//             icon: "/assets/icons/projectsIcon.png",
//             productDescription: "Productos a producir:",
//             products: [
//                 {
//                     icon: "/assets/modifiersIcons/products/13.png",
//                     id: 13,
//                     title: "Reorganizacion"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/2.png",
//                     id: 2,
//                     title: "Reorganizacion"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/33.png",
//                     id: 33,
//                     title: "Reorganizacion"
//                 }
//             ]
//         }
//     }
// ]
