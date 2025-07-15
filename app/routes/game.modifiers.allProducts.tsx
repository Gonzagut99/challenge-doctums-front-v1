// import type { LoaderFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
// import { globalWebSocketService } from "~/services/ws";
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
    // const domainProductsObject = await loadProducts("app/data/products.csv");
    const domainProductsObject = initializedDataLoader.getProducts();
    const domainProductsValues = Object.values(domainProductsObject);
    // if (myProducts.length===0) {
    //     myProducts = Object.values(domainProductsObject).map((product) => ({
    //         id: product.ID,
    //         is_enabled: false,
    //         was_bought: false,
    //         purchased_requirements: product.requirements,
    //     }));
    // }
    const productsTabletTileData: MyProductTableTileData[] =
        domainProductsValues.map((product) => ({
            id: product.ID,
            title: domainProductsObject[product.ID].name,
            icon: `/assets/modifiersIcons/products/${product.ID}.png`,
            productDescription: "Requiere para activarse:",
            enabled: false,
            products: domainProductsObject[product.ID].requirements.map(
                (product) => ({
                    icon: `/assets/modifiersIcons/products/${product}.png`,
                    id: Number(product),
                    title: domainProductsObject[product].name,
                })
            ),
        }));
    // const alreadyAcquiredProductsIds = myProducts.map((product) => product.id);
    return json({
        productsTabletTileData,
        domainProductsObject,
        // alreadyAcquiredProductsIds
    });
};

export default function AllProducts() {
    const { productsTabletTileData: products, domainProductsObject } =
        useLoaderData<typeof loader>();
    const [isModalOpen, setIsModalOpen] = useState(true);

    const navigate = useNavigate();

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
        // navigate('/game')
    }
    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {isModalOpen && (
                <Modal
                    title="Catálogo de productos"
                    onDismiss={handleDismiss}
                    type="back"
                    className="h-full pb-10"
                >
                    <div className="flex flex-col gap-2">
                        <p className="space-y-4 px-5 py-4 font-rajdhani font-semibold leading-snug text-lg">
                            Objetos o mejoras que, una vez adquiridos te
                            ayudarán a ganar más puntos en futuras etapas.
                        </p>
                        <div className="overflow-auto scrollbar-thin max-h-[410px]">
                            <div className="grid grid-cols-2 gap-2">
                                {products.length > 0 &&
                                    products.map((product) => {
                                        return (
                                            <ModifierTabletTile
                                                key={product.title}
                                                tabletTileData={product}
                                            >
                                                <button
                                                    className="flex items-center gap-2 border-2 border-zinc-900 bg-[#99C579] px-2 disabled:opacity-80"
                                                    // onClick={() =>
                                                    //     handleSelectProduct(
                                                    //         product.id
                                                    //     )
                                                    // }
                                                    // disabled={alreadyAcquired}
                                                    disabled
                                                    // title={
                                                    //     alreadyAcquired
                                                    //         ? "Ya tienes este producto"
                                                    //         : "Aún no tienes este producto"
                                                    // }
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
                                                        {domainProductsObject[product.id].cost}
                                                    </span>
                                                </button>
                                            </ModifierTabletTile>
                                        );
                                    })}
                            </div>
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
