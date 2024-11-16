import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import {
    BuyProjectTableTileData,
} from "~/types/modifiers";
import { loadProducts, loadProjects } from "~/utils/dataLoader";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const domainProjects = await loadProjects("app/data/projects.csv");
    const domainProducts = await loadProducts("app/data/products.csv");
    const projects = Object.values(domainProjects);

    const tileProducts: BuyProjectTableTileData[] = projects.map((project) => ({
        title: project.name,
        icon: `/assets/icons/projectsIcon.png`,
        productDescription: "Requiere:",
        cost: project.cost,
        products: project.delivered_products.map((dlv) => ({
            icon: `/assets/modifiersIcons/products/${domainProducts[dlv].ID}.png`,
            id: Number(dlv),
            title:domainProducts[dlv].name
        })),
    }));

    return json(tileProducts);
}

export default function BuyProjects() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const navigate = useNavigate();
    const tileProjects = useLoaderData<typeof loader>();

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
    }
    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {isModalOpen && (
                <Modal type="back" title="Compra productos" onDismiss={handleDismiss}>
                    <div className="flex flex-col gap-2">
                        <p className="space-y-4 px-5 py-4 font-easvhs text-lg">
                            Misiones o tareas que al pasar tres meses te otorgan productos.
                        </p>
                        <div className="flex-grow max-h-[430px] overflow-y-auto scrollbar-thin">
                            <div className="grid grid-cols-2 gap-2">
                                {tileProjects.map((project) => (
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