import { useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import { ModifiersTabletTileData } from "~/types/modifiers";
// import { ModifiersTabletTileData } from "~/types/Modifiers";

// type ProductFeature = {
//     icon: string;
//     id: number;
// }

// interface TabletTileData{
//     title: string;
//     icon: string;
//     productDescription: 'Productos a producir:' | 'Productos a desarrollar:' | 'Requiere:';
//     products: ProductFeature[];
// }
function MyProducts() {
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
        <Modal title="Tus productos" onDismiss={handleDismiss}>
            <div className="flex flex-col gap-2">
                <p className="space-y-4 px-5 py-4 font-easvhs text-lg">Objetos o mejoras que, una vez adquiridos te ayudarán a ganar más puntos en futuras etapa</p>
                <div className="grid grid-cols-2 gap-2">
                    {
                        myProducts.map((product) => (
                            <ModifierTabletTile key={product.title} tabletTileData={product}>
                            </ModifierTabletTile>
                        ))

                    }
                </div>
            </div>

        </Modal>
    )}
    </AnimatePresence>
  )
}

const myProducts: ModifiersTabletTileData[] = [
    {
        title: "Problemas de negocios que se pretenden resolver",
        icon: "/assets/modifiersIcons/products/1.png",
        productDescription: "Requiere:",
        products: [
            {
                icon: "/assets/modifiersIcons/products/1.png",
                id: 1
            },
            {
                icon: "/assets/modifiersIcons/products/3.png",
                id: 3
            },
        ]
    },
    {
        title: "Definición de expectativas de apego baseline",
        icon: "/assets/modifiersIcons/products/3.png",
        productDescription: "Requiere:",
        products: [
            {
                icon: "/assets/modifiersIcons/products/2.png",
                id: 2
            },
            {
                icon: "/assets/modifiersIcons/products/1.png",
                id: 1
            },
        ]
    },
    {
        title: "Analisis de interfaces con otras aplicaciones",
        icon: "/assets/modifiersIcons/products/2.png",
        productDescription: "Requiere:",
        products: [
            {
                icon: "/assets/modifiersIcons/products/3.png",
                id: 3
            },
            {
                icon: "/assets/modifiersIcons/products/1.png",
                id: 1
            },
            {
                icon: "/assets/modifiersIcons/products/2.png",
                id: 2
            }
        ]
    }
]

export default MyProducts