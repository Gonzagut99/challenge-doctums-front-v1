import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import {
    BuyResourceTableTileData
} from "~/types/modifiers";
import { loadProducts, loadResources } from "~/utils/dataLoader";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const domainResources = await loadResources("app/data/resources.csv");
    const domainProducts = await loadProducts("app/data/products.csv");
    const resources = Object.values(domainResources);

    const tileResources: BuyResourceTableTileData[] = resources.map((resource) => ({
        title: resource.name,
        icon: `/assets/icons/projectsIcon.png`,
        productDescription: "Requiere:",
        cost: resource.cost,
        products: resource.developed_products.map((dlv) => ({
            icon: `/assets/modifiersIcons/products/${domainProducts[dlv].ID}.png`,
            id: Number(dlv),
            title:domainProducts[dlv].name
        })),
    }));

    return json(tileResources);
}

export default function BuyResources() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const navigate = useNavigate();
    const tileResources = useLoaderData<typeof loader>();

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
    }
    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {isModalOpen && (
                <Modal type="back" title="Compra recursos" onDismiss={handleDismiss}>
                    <div className="flex flex-col gap-2">
                        <div>
                            <p className="space-y-4 px-5 py-4 font-easvhs text-lg">
                                Herramientas, tiempo y equipo humano necesarios para ejecutar tus proyectos, que además, desarrollan productos.
                            </p>
                            <div className="px-11">
                                <div className="border-[3px] border-zinc-900 bg-[#FFE96F] rounded-md font-easvhs px-3 py-2 flex gap-2 items-center">
                                    <img src="/assets/icons/warningIcon.png" alt="WarningIcon" />
                                    <p className="text-center">
                                    Por cada recurso contratado tendras que pagar mensualmente 250 en salarios.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow max-h-[430px] overflow-y-auto scrollbar-thin">
                            <div className="grid grid-cols-2 gap-2">
                                {tileResources.map((project) => (
                                    <ModifierTabletTile
                                        key={project.title}
                                        tabletTileData={project}
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
                                            {project.cost}
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