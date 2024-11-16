import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import {
    BuyProductTableTileData,
} from "~/types/modifiers";
import { loadProducts } from "~/utils/dataLoader";
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const domainProducts = await loadProducts("app/data/products.csv");
    const products = Object.values(domainProducts);

    const tileProducts: BuyProductTableTileData[] = products.map((product) => ({
        title: product.name,
        icon: `/assets/modifiersIcons/products/${product.ID}.png`,
        productDescription: "Requiere:",
        cost: product.cost,
        products: product.requirements.map((req) => ({
            icon: `/assets/modifiersIcons/products/${req}.png`,
            id: Number(req),
            title:product.name
        })),
    }));

    return json(tileProducts);
}


export default function BuyProducts() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const navigate = useNavigate();
    const tileProducts = useLoaderData<typeof loader>();

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
    }
    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {isModalOpen && (
                <Modal title="Compra productos" onDismiss={handleDismiss} type="back">
                    <div className="flex flex-col gap-2">
                        <p className="space-y-4 px-5 py-4 font-easvhs text-lg">
                            Objetos o mejoras que, una vez adquiridos te
                            ayudarán a ganar más puntos en futuras etapas.
                        </p>
                        <div className="flex-grow max-h-[400px] overflow-y-auto scrollbar-thin">
                            <div className="grid grid-cols-2 gap-2">
                                {tileProducts.map((product) => (
                                    <ModifierTabletTile
                                        key={product.title}
                                        tabletTileData={product}
                                        // className="max-h-[110px]"
                                    >
                                        <div
                                    className="flex items-center gap-2 border-2 border-zinc-900 bg-[#99C579] px-2"
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
                                            {product.cost}
                                        </span>
                                    </div>
                                        {/* <span className="text-green-500">
                                                {product.cost}
                                        </span> */}
                                    </ModifierTabletTile>
                                ))}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </AnimatePresence>
    );
}

// const myProducts: BuyProductTableTileData[] = [
//     {
//         title: "Problemas de negocios que se pretenden resolver",
//         icon: "/assets/modifiersIcons/products/1.png",
//         productDescription: "Requiere:",
//         cost: 100,
//         products: [
//             {
//                 icon: "/assets/modifiersIcons/products/1.png",
//                 id: 1,
//             },
//             {
//                 icon: "/assets/modifiersIcons/products/3.png",
//                 id: 3,
//             },
//         ],
//     },
//     {
//         title: "Definición de expectativas de apego baseline",
//         icon: "/assets/modifiersIcons/products/3.png",
//         productDescription: "Requiere:",
//         enabled: true,
//         products: [
//             {
//                 icon: "/assets/modifiersIcons/products/2.png",
//                 id: 2,
//             },
//             {
//                 icon: "/assets/modifiersIcons/products/1.png",
//                 id: 1,
//             },
//         ],
//     },
//     {
//         title: "Analisis de interfaces con otras aplicaciones",
//         icon: "/assets/modifiersIcons/products/2.png",
//         productDescription: "Requiere:",
//         enabled: false,
//         products: [
//             {
//                 icon: "/assets/modifiersIcons/products/3.png",
//                 id: 3,
//             },
//             {
//                 icon: "/assets/modifiersIcons/products/1.png",
//                 id: 1,
//             },
//             {
//                 icon: "/assets/modifiersIcons/products/2.png",
//                 id: 2,
//             },
//         ],
//     },
// ];


