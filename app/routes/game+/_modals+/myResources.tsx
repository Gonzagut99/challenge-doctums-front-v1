import { useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import { ModifiersTabletTileData } from "~/types/modifiers";


export default function MyResources() {
    const maxMonths = 1;
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
        <Modal title="Tus recursos" onDismiss={handleDismiss}>
            <div className="flex flex-col gap-2">
                <p className="space-y-4 px-5 py-4 font-easvhs text-lg">Herramienta, tiempo y equipo humano necesarios para ejecutar tus proyectos, que además, desarrollan productos.</p>
                <div className="grid grid-cols-2 gap-2">
                    {
                        myResources.map((project) => {
                            const monthsCompleted = maxMonths-project.remainingMonths;
                            const waitingMonthsCompletedClass = monthsCompleted === maxMonths ? 'text-green-500' : '';
                            return (
                                <ModifierTabletTile key={project.generalData.title} tabletTileData={project.generalData}>
                                <span className={twMerge('font-dogica-bold text-lg', waitingMonthsCompletedClass)}>
                                    {monthsCompleted}/{maxMonths}
                                </span>
                            </ModifierTabletTile>
                            )
                        })

                    }
                </div>
            </div>

        </Modal>
    )}
    </AnimatePresence>
  )
}

interface MyResourcesTileData{
    remainingMonths: number;
    generalData: ModifiersTabletTileData;
}

const myResources: MyResourcesTileData[] = [
    {
        remainingMonths: 1,
        generalData: {
            title: "Oficina del proyecto",
            icon: "/assets/icons/resourcesIcon.png",
            productDescription: "Productos a desarrollar:",
            products: [
                {
                    icon: "/assets/modifiersIcons/products/40.png",
                    id: 40
                },
                {
                    icon: "/assets/modifiersIcons/products/16.png",
                    id: 16
                },
                {
                    icon: "/assets/modifiersIcons/products/21.png",
                    id: 21
                }
            ]
        }
    },
    {
        remainingMonths: 0,
        generalData: {
            title: "Comunicaciones",
            icon: "/assets/icons/resourcesIcon.png",
            productDescription: "Productos a desarrollar:",
            products: [
                {
                    icon: "/assets/modifiersIcons/products/5.png",
                    id: 5
                },
                {
                    icon: "/assets/modifiersIcons/products/46.png",
                    id: 46
                },
                {
                    icon: "/assets/modifiersIcons/products/30.png",
                    id: 30
                }
            ]
        }
    },
    {
        remainingMonths: 0,
        generalData: {
            title: "Procesos",
            icon: "/assets/icons/resourcesIcon.png",
            productDescription: "Productos a desarrollar:",
            products: [
                {
                    icon: "/assets/modifiersIcons/products/12.png",
                    id: 12
                },
                {
                    icon: "/assets/modifiersIcons/products/24.png",
                    id: 24
                },
                {
                    icon: "/assets/modifiersIcons/products/39.png",
                    id: 39
                }
            ]
        }
    }
]