// import type { LoaderFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button2 } from "~/components/custom/Button2";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import { getWebSocketService, WebSocketService } from "~/services/ws";
import { MyProductTableTileData } from "~/types/modifiers";
import { initializedDataLoader } from "~/utils/dataLoader";
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const sessionCode = url.searchParams.get("sessionCode") as string;
    const playerId = url.searchParams.get("playerId") as string;
    const globalWebSocketService = getWebSocketService(sessionCode, playerId) as WebSocketService ;
    
    // const domainProductsObject = await loadProducts("app/data/products.csv");
    const domainProductsObject = initializedDataLoader.getProducts();
    //const domainProductsValues = Object.values(domainProductsObject)
    let myProducts = globalWebSocketService.localPlayerModifiers.products;
    let productsTabletTileData: MyProductTableTileData[];
    let alreadyAcquiredProductsIds: string[];
    if (myProducts.length > 0) {
        productsTabletTileData = myProducts.map((product) => ({
            id: product.id,
            title: domainProductsObject[product.id].name,
            icon: `/assets/modifiersIcons/products/${product.id}.png`,
            productDescription: "Requiere para activarse:",
            enabled: product.is_enabled ?? false,
            products: domainProductsObject[product.id].requirements.map(
                (product) => ({
                    icon: `/assets/modifiersIcons/products/${product}.png`,
                    id: Number(product),
                    title: domainProductsObject[product].name,
                })
            ),
        }));
        alreadyAcquiredProductsIds = myProducts.map((product) => product.id);
    } else {
        myProducts = [];
        productsTabletTileData = [];
        alreadyAcquiredProductsIds = [];
    }

    return json({
        productsTabletTileData,
        alreadyAcquiredProductsIds,
    });
};

function MyProducts() {
    const { productsTabletTileData: myProducts, alreadyAcquiredProductsIds } =
        useLoaderData<typeof loader>();
    const [isModalOpen, setIsModalOpen] = useState(true);

    const navigate = useNavigate();

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
    }
    function goToProductCatalogue() {
        navigate('/game/allProducts')
    }
    console.log('MyProducts', myProducts);
    console.log('alreadyAcquiredProductsIds', alreadyAcquiredProductsIds);
    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {isModalOpen && (
                <Modal title="Tus productos" onDismiss={handleDismiss} className="h-full pb-10">
                    {myProducts.length > 0 &&
                        alreadyAcquiredProductsIds.length > 0 && (
                            <div className="flex flex-col gap-2 h-full">
                                <p className="space-y-4 px-5 py-4 font-rajdhani font-semibold leading-snug text-lg">
                                    Objetos o mejoras que, una vez adquiridos te
                                    ayudarán a ganar más puntos en futuras
                                    etapas.
                                </p>
                                <div className="grid grid-cols-2 gap-2 overflow-auto scrollbar-thin">
                                    {myProducts.length > 0 &&
                                        myProducts.map((product) => {
                                            return (
                                                <ModifierTabletTile
                                                    key={product.title}
                                                    tabletTileData={product}
                                                    alreadyAcquiredProducts={
                                                        alreadyAcquiredProductsIds
                                                    }
                                                >
                                                    {product.enabled && (
                                                        <span className="text-green-500">
                                                            Activado
                                                        </span>
                                                    )}
                                                </ModifierTabletTile>
                                            );
                                        })}
                                    {/* {myProducts.length === 0 && (
                                        <div className="text-[10px] font-easvhs opacity-50 pt-2 text-center">
                                            No cuentas con ningun producto aún.
                                        </div>
                                    )} */}
                                </div>
                                <div className="flex justify-center flex-grow items-center">
                                    <Button2 onClick={goToProductCatalogue} className="px-4 h-fit text-zinc-50 font-easvhs py-4">Ver catálogo de productos</Button2>
                                </div>
                            </div>
                        )}
                    {
                        myProducts.length === 0 &&
                        alreadyAcquiredProductsIds.length === 0 && (
                            <div className="flex justify-center items-center flex-col h-full w-full">
                                <p className="space-y-4 px-5 py-4 font-rajdhani font-semibold text-lg opacity-50 pt-2 text-center ">
                                    No cuentas con ningun producto aún.
                                </p>
                                <Button2 onClick={goToProductCatalogue} className="px-4 h-fit text-zinc-50 font-easvhs py-4">Ver catálogo de productos</Button2>
                            </div>
                        )
                    }
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
