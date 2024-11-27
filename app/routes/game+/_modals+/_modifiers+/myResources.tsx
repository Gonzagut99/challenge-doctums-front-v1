// import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button2 } from "~/components/custom/Button2";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import { globalWebSocketService } from "~/services/ws";
import { ModifiersTabletTileData } from "~/types/modifiers";
import { loadProducts, loadResources } from "~/utils/dataLoader";

interface MyResourcesTileData {
    remainingMonths: number;
    generalData: ModifiersTabletTileData;
}

export const loader = async () => {
    const domainResourcesObject = await loadResources("app/data/resources.csv");
    const domainProductsObject = await loadProducts("app/data/products.csv");
    // const domainResourcesValues = Object.values(domainResourcesObject);
    console.log(domainResourcesObject);
    let myResources = globalWebSocketService.localPlayerModifiers.resources;
    let myProducts = globalWebSocketService.localPlayerModifiers.products;
    let myResourcesTileData: MyResourcesTileData[];
    let alreadyAcquiredProductsIds: string[];

    if (myResources.length > 0) {
        myResourcesTileData = myResources.map((resource) => ({
            remainingMonths: resource.remaining_time ?? 0,
            generalData: {
                id: resource.id,
                title: domainResourcesObject[resource.id].name,
                icon: `/assets/icons/resourcesIcon.png`,
                productDescription: "Productos a desarrollar:",
                products: domainResourcesObject[
                    resource.id
                ].developed_products.map((product) => ({
                    icon: `/assets/modifiersIcons/products/${product}.png`,
                    id: Number(product),
                    title: domainProductsObject[product].name,
                })),
            },
        }));
        alreadyAcquiredProductsIds = myProducts.map((product) => product.id);
    } else {
        myResources = [];
        myProducts = [];
        myResourcesTileData = [];
        alreadyAcquiredProductsIds = [];
    }
    return json({ myResourcesTileData, alreadyAcquiredProductsIds });
};

export default function MyResources() {
    const { myResourcesTileData: myResources, alreadyAcquiredProductsIds } =
        useLoaderData<typeof loader>();
    const maxMonths = 1;
    const [isModalOpen, setIsModalOpen] = useState(true);

    const navigate = useNavigate();

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
    }

    function goToResourceCatalogue() {
        navigate("/game/allResources");
    }
    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {isModalOpen && (
                <Modal
                    title="Tus recursos"
                    onDismiss={handleDismiss}
                    className="h-full pb-10"
                >
                    {myResources.length > 0 &&
                        alreadyAcquiredProductsIds.length > 0 && (
                            <div className="flex flex-col gap-2 h-full">
                                <p className="space-y-4 px-5 py-4 font-rajdhani font-semibold leading-snug text-lg">
                                    Herramienta, tiempo y equipo humano
                                    necesarios para ejecutar tus proyectos, que
                                    además, desarrollan productos.
                                </p>
                                <div className="grid grid-cols-2 gap-2 overflow-auto scrollbar-thin">
                                    {myResources.map((project) => {
                                        const monthsCompleted =
                                            maxMonths - project.remainingMonths;
                                        const waitingMonthsCompletedClass =
                                            monthsCompleted === maxMonths
                                                ? "text-green-500"
                                                : "";
                                        return (
                                            <ModifierTabletTile
                                                key={project.generalData.title}
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
                                </div>
                                <div className="flex justify-center flex-grow items-center">
                                    <Button2
                                        onClick={goToResourceCatalogue}
                                        className="px-4 h-fit text-zinc-50 font-easvhs py-4"
                                    >
                                        Ver perfiles de recursos humanos
                                    </Button2>
                                </div>
                            </div>
                        )}
                        {
                            myResources.length === 0 &&
                            alreadyAcquiredProductsIds.length === 0 && (
                                <div className="flex justify-center items-center flex-col h-full w-full">
                                    <p className="space-y-4 px-5 py-4 text-lg opacity-50 pt-2 text-center font-rajdhani leading-tight font-semibold">
                                        No cuentas con ningún recurso humano aún.
                                    </p>
                                    <Button2 onClick={goToResourceCatalogue} className="px-4 h-fit text-zinc-50 font-easvhs py-4">Ver perfiles de recursos humanos</Button2>
                                </div>
                            )
                        }
                </Modal>
            )}
        </AnimatePresence>
    );
}

// const myResources: MyResourcesTileData[] = [
//     {
//         remainingMonths: 1,
//         generalData: {
//             title: "Oficina del proyecto",
//             icon: "/assets/icons/resourcesIcon.png",
//             productDescription: "Productos a desarrollar:",
//             products: [
//                 {
//                     icon: "/assets/modifiersIcons/products/40.png",
//                     id: 40,
//                     title: "Oficina del proyecto"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/16.png",
//                     id: 16,
//                     title: "Oficina del proyecto"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/21.png",
//                     id: 21,
//                     title: "Oficina del proyecto"
//                 }
//             ]
//         }
//     },
//     {
//         remainingMonths: 0,
//         generalData: {
//             title: "Comunicaciones",
//             icon: "/assets/icons/resourcesIcon.png",
//             productDescription: "Productos a desarrollar:",
//             products: [
//                 {
//                     icon: "/assets/modifiersIcons/products/5.png",
//                     id: 5,
//                     title: "Comunicaciones"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/46.png",
//                     id: 46,
//                     title: "Comunicaciones"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/30.png",
//                     id: 30,
//                     title: "Comunicaciones"
//                 }
//             ]
//         }
//     },
//     {
//         remainingMonths: 0,
//         generalData: {
//             title: "Procesos",
//             icon: "/assets/icons/resourcesIcon.png",
//             productDescription: "Productos a desarrollar:",
//             products: [
//                 {
//                     icon: "/assets/modifiersIcons/products/12.png",
//                     id: 12,
//                     title: "Procesos"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/24.png",
//                     id: 24,
//                     title: "Procesos"
//                 },
//                 {
//                     icon: "/assets/modifiersIcons/products/39.png",
//                     id: 39,
//                     title: "Procesos"
//                 }
//             ]
//         }
//     }
// ]
