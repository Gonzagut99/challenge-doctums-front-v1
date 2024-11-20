// import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import { globalWebSocketService } from "~/services/ws";
import {
    MyProductTableTileData,
} from "~/types/modifiers";
import { loadProducts } from "~/utils/dataLoader";
// import { ModifiersTabletTileData } from "~/types/Modifiers";

// export interface ModifiersTabletTileData{
//     id: string;
//     title: string;
//     icon: string;
//     productDescription: 'Productos a producir:' | 'Productos a desarrollar:' | 'Requiere para activarse:';
//     products: ProductFeature[];
// }

// export interface MyProductTableTileData extends ModifiersTabletTileData{
//     enabled:boolean;
// }


export const loader = async () => {
    const domainProductsObject = await loadProducts("app/data/products.csv");
    //const domainProductsValues = Object.values(domainProductsObject)
    let myProducts = globalWebSocketService.localPlayerModifiers.products;
    if (myProducts.length===0) {
        myProducts = Object.values(domainProductsObject).map((product) => ({
            id: product.ID,
            is_enabled: false,
            was_bought: false,
            purchased_requirements: product.requirements,
        }));
    }
    const productsTabletTileData: MyProductTableTileData[] = myProducts.map((product) => ({
            id: product.id,
            title: domainProductsObject[product.id].name,
            icon: `/assets/modifiersIcons/products/${product.id}.png`,
            productDescription: "Requiere para activarse:",
            enabled: product.is_enabled??false,
            products: domainProductsObject[product.id].requirements.map((product) => ({
                icon: `/assets/modifiersIcons/products/${product}.png`,
                id: Number(product),
                title: domainProductsObject[product].name,
            })),
        }));
    const alreadyAcquiredProductsIds = myProducts.map((product) => product.id);
    return json({
        productsTabletTileData,
        alreadyAcquiredProductsIds
    })
};


function MyProducts() {
    const { productsTabletTileData: myProducts, alreadyAcquiredProductsIds } = useLoaderData<typeof loader>();
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
                        <p className="space-y-4 px-5 py-4 font-easvhs text-lg">
                            Objetos o mejoras que, una vez adquiridos te
                            ayudarán a ganar más puntos en futuras etapas.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {myProducts.length>0 && myProducts.map((product) => {
                                return (
                                <ModifierTabletTile
                                    key={product.title}
                                    tabletTileData={product}
                                    alreadyAcquiredProducts={alreadyAcquiredProductsIds}
                                >
                                    {product.enabled && (
                                        <span className="text-green-500">
                                            Activado
                                        </span>
                                    )}
                                </ModifierTabletTile>
                            )})}
                            {myProducts.length === 0 && (
                                <div className="text-[10px] font-easvhs opacity-50 pt-2 text-center">
                                    No cuentas con ningun producto aún.
                                    </div>
                                    )}
                        </div>
                    </div>
                </Modal>
            )}
        </AnimatePresence>
    );
}

// const myProducts: MyProductTableTileData[] = [
//     {
//         title: "Problemas de negocios que se pretenden resolver",
//         icon: "/assets/modifiersIcons/products/1.png",
//         productDescription: "Requiere:",
//         enabled: true,
//         products: [
//             {
//                 icon: "/assets/modifiersIcons/products/1.png",
//                 id: 1,
//                 title: "Problemas de negocios que se pretenden resolver",
//             },
//             {
//                 icon: "/assets/modifiersIcons/products/3.png",
//                 id: 3,
//                 title: "Problemas de negocios que se pretenden resolver",
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
//                 title: "Definición de expectativas de apego baseline",
//             },
//             {
//                 icon: "/assets/modifiersIcons/products/1.png",
//                 id: 1,
//                 title: "Definición de expectativas de apego baseline",
//             },
//         ],
//     },
//     {
//         id: '3',
//         title: "Analisis de interfaces con otras aplicaciones",
//         icon: "/assets/modifiersIcons/products/2.png",
//         productDescription: "Requiere para activarse:",
//         enabled: false,
//         products: [
//             {
//                 icon: "/assets/modifiersIcons/products/3.png",
//                 id: 3,
//                 title: "Analisis de interfaces con otras aplicaciones",
//             },
//             {
//                 icon: "/assets/modifiersIcons/products/1.png",
//                 id: 1,
//                 title: "Analisis de interfaces con otras aplicaciones",
//             },
//             {
//                 icon: "/assets/modifiersIcons/products/2.png",
//                 id: 2,
//                 title: "Analisis de interfaces con otras aplicaciones",
//             },
//         ],
//     },
// ];

export default MyProducts;
