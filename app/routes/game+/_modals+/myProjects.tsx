// import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import { globalWebSocketService } from "~/services/ws";
import { ModifiersTabletTileData } from "~/types/modifiers";
import { loadProducts, loadProjects } from "~/utils/dataLoader";

interface MyProjectsTileData{
    remainingMonths: number;
    generalData: ModifiersTabletTileData;
}


export const loader = async () => {
    const domainProjectsObject = await loadProjects("app/data/projects.csv");
    // const domainProjectsValues = Object.values(domainProjectsObject);
    let myProjects = globalWebSocketService.localPlayerModifiers.projects;
    if (myProjects.length===0) {
        myProjects = Object.values(await loadProjects("app/data/projects.csv")).map((project) => ({
            id: project.ID,
            remaining_time: 3,
        }));
    }
    let myProducts = globalWebSocketService.localPlayerModifiers.products;
    if (myProducts.length===0) {
        myProducts = Object.values(await loadProducts("app/data/products.csv")).map((product) => ({
            id: product.ID,
            is_enabled: false,
            was_bought: false,
            purchased_requirements: product.requirements,
        }));
    }
    const myProjectsTileData: MyProjectsTileData[] = myProjects.map((project) => ({
        remainingMonths: project.remaining_time ?? 0,
        generalData: {
            id: project.id,
            title: domainProjectsObject[project.id].name,
            icon: `/assets/icons/projectsIcon.png`,
            productDescription: "Productos a producir:",
            products: domainProjectsObject[project.id].delivered_products.map((product) => ({
                icon: `/assets/modifiersIcons/products/${product}.png`,
                id: Number(product),
                title: domainProjectsObject[product].name,
            })),
        }
    }));
    const alreadyAcquiredProductsIds = myProducts.map((product) => product.id);
  return json({ myProjectsTileData, alreadyAcquiredProductsIds });
};

export default function MyProjects() {
    const { myProjectsTileData: myProjects, alreadyAcquiredProductsIds } = useLoaderData<typeof loader>();
    const maxMonths = 3;
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
        <Modal title="Tus proyectos" onDismiss={handleDismiss}>
            <div className="flex flex-col gap-2">
                <p className="space-y-4 px-5 py-4 font-easvhs text-lg">Objetos o mejoras que, una vez adquiridos te ayudarán a ganar más puntos en futuras etapa</p>
                <div className="grid grid-cols-2 gap-2">
                    {
                        myProjects.length>0 && myProjects.map((project) => {
                            const monthsCompleted = maxMonths-project.remainingMonths;
                            const waitingMonthsCompletedClass = monthsCompleted === maxMonths ? 'text-green-500' : '';
                            return (
                                <ModifierTabletTile 
                                    key={project.generalData.title} 
                                    tabletTileData={project.generalData}
                                    alreadyAcquiredProducts={alreadyAcquiredProductsIds??[]}
                                >
                                <span className={twMerge('font-dogica-bold text-lg', waitingMonthsCompletedClass)}>
                                    {monthsCompleted}/{maxMonths}
                                </span>
                            </ModifierTabletTile>
                            )
                        })

                    }
                    {
                        myProjects.length === 0 && (
                            <div className="text-[12px] font-easvhs opacity-50 pt-2 text-center">No cuentas con ningun proyecto ejecutándose aún</div>
                        )
                    }
                </div>
            </div>

        </Modal>
    )}
    </AnimatePresence>
  )
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