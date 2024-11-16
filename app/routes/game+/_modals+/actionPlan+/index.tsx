import type { LoaderFunctionArgs } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "~/components/custom/Modal";
import { GameControlButton } from "../..";
import { WhiteContainer } from "~/components/custom/WhiteContainer";
import { Button2 } from "~/components/custom/Button2";

export default function ActionPlan() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    // const data = useLoaderData<typeof loader>();
    // const myEfficiencies = data.myEfficiencies;
    const totalPrtce = 1000;
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
                <Modal title="Plan de Acción" onDismiss={handleDismiss}>
                    <div className="flex flex-col gap-2">
                        <p className="space-y-4 px-5 py-4 font-easvhs text-lg">
                            Ha llegado el momento de planear tu plan de acción.
                            Dale click a cada item para que puedas comprar.
                        </p>
                        <div className="flex-grow max-h-[430px] overflow-y-auto">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {actionPlanButtons.map((button) => (
                                    <WhiteContainer
                                        key={button.control}
                                        onClick={() =>
                                            navigate(`/game/actionPlan/${button.control}`)
                                        }
                                        className="max-w-80"
                                    >
                                        <div className="flex gap-2">
                                            <figure className="w-16 min-w-16">
                                                <img
                                                    src={button.icon}
                                                    alt="Icon"
                                                    className="object-contain aspect-square !w-16"
                                                />
                                            </figure>
                                            <div className="grow">
                                                <h4 className="text-sm font-easvhs">
                                                    {button.title}
                                                </h4>
                                                <p className="text-[0.60rem] font-easvhs">
                                                    {button.description}
                                                </p>
                                            </div>
                                        </div>
                                    </WhiteContainer>
                                ))}
                            </div>
                        </div>
                        <div className="min-h-[230px] max-h-[230px] overflow-auto flex flex-col gap-2 bg-zinc-50 rounded-md p-4 border-zinc-900 border-[3px] relative">
                            <header>
                                <h4 className="font-easvhs text-lg">
                                    Resumen Modificadores a adquirir
                                </h4>
                            </header>
                            <div className="grid grid-cols-[2fr_1fr]">
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <h5 className="font-easvhs text-md mb-2">Productos</h5>
                                        <div className="flex flex-col gap-1">
                                            {modifiersCheckout.products.map(
                                                (product) => (
                                                    <div
                                                        key={product.id}
                                                        className="flex gap-2"
                                                    >
                                                        <figure className="size-6">
                                                            <img
                                                                src={product.icon}
                                                                alt="Icon"
                                                                className="object-contain aspect-square size-6"
                                                            />
                                                        </figure>
                                                        <div>
                                                            <p>{product.title}</p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-easvhs text-md mb-2">Recursos</h5>
                                        <div className="flex flex-col gap-1">
                                            {modifiersCheckout.resources.map(
                                                (resource) => (
                                                    <div
                                                        key={resource.id}
                                                        className="flex gap-2"
                                                    >
                                                        <figure className="size-6">
                                                            <img
                                                                src={resource.icon}
                                                                alt="Icon"
                                                                className="object-contain aspect-square size-6"
                                                            />
                                                        </figure>
                                                        <div>
                                                            <p>{resource.title}</p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-easvhs text-md mb-2">Proyectos</h5>
                                        <div className="flex flex-col gap-1">
                                            {modifiersCheckout.projects.map(
                                                (project) => (
                                                    <div
                                                        key={project.id}
                                                        className="flex gap-2"
                                                    >
                                                        <figure className="size-6">
                                                            <img
                                                                src={project.icon}
                                                                alt="Icon"
                                                                className="object-contain aspect-square size-6"
                                                            />
                                                        </figure>
                                                        <div>
                                                            <p>{project.title}</p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-20 right-0 max-w-72 w-72 flex flex-col gap-2 items-end">
                                <div className="flex gap-2 w-fit">
                                    <span className="font-easvhs text-2xl">
                                        Total:
                                    </span>
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
                                                className="size-8"
                                            />
                                        </figure>
                                        <span className="font-easvhs text-xl">
                                            {totalPrtce}
                                        </span>
                                    </div>
                                </div>
                                <Button2 className="btn btn-primary w-full font-easvhs text-zinc-50 text-xl">
                                    Enviar Plan
                                </Button2>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </AnimatePresence>
    );
}

const actionPlanButtons: GameControlButton[] = [
    {
        icon: "/assets/icons/productsIcon.png",
        title: "Comprar Productos",
        description:
            "Objetos o mejoras que, una vez adquiridos te ayudarán a ganar más puntos en futuras etapa.",
        control: "buyProducts",
    },
    {
        icon: "/assets/icons/resourcesIcon.png",
        title: "Comprar Recursos",
        description:
            "Herramienta, tiempo y equipo humano necesarios para ejecutar tus proyectos.",
        control: "buyResources",
    },
    {
        icon: "/assets/icons/projectsIcon.png",
        title: "Comprar Proyectos",
        description:
            "Misiones o tareas que, al completarse, te otorgan productos.",
        control: "buyProjects",
    },
];

interface ModifiersCheckout {
    products: ProductCheckoutFeature[];
    resources: ResourceCheckoutFeature[];
    projects: ProjectCheckoutFeature[];
}

interface ModifiersCheackoutFeature {
    id: string;
    title: string;
    icon: string;
}

interface ProductCheckoutFeature extends ModifiersCheackoutFeature {}

interface ResourceCheckoutFeature extends ModifiersCheackoutFeature {}

interface ProjectCheckoutFeature extends ModifiersCheackoutFeature {}

const modifiersCheckout: ModifiersCheckout = {
    products: [
        {
            id: "46",
            title: "Product 1",
            icon: "/assets/modifiersIcons/products/46.png",
        },
        {
            id: "30",
            title: "Product 2",
            icon: "/assets/modifiersIcons/products/30.png",
        },
    ],
    resources: [
        {
            id: "1",
            title: "Resource 1",
            icon: "/assets/icons/resourcesIcon.png",
        },
        {
            id: "2",
            title: "Resource 2",
            icon: "/assets/icons/resourcesIcon.png",
        },
    ],
    projects: [
        {
            id: "1",
            title: "Project 1",
            icon: "/assets/icons/projectsIcon.png",
        },
        {
            id: "2",
            title: "Project 2",
            icon: "/assets/icons/projectsIcon.png",
        },
    ],
};
