import type { ActionFunctionArgs } from "@remix-run/node";
import { json, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button2 } from "~/components/custom/Button2";
import { CostButton } from "~/components/custom/CostButton";
import Modal from "~/components/custom/Modal";
import { ModifierTabletTile } from "~/components/custom/ModifiersTabletTile";
import { actionPlanState } from "~/services/ws/actionPlanState.server";
import { BuyProductTableTileData } from "~/types/modifiers";
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

export const loader = async () => {
    const domainProducts = await loadProducts("app/data/products.csv");
    const products = Object.values(domainProducts);

    const tileProducts: BuyProductTableTileData[] = products.map((product) => ({
        id: product.ID,
        title: product.name,
        icon: `/assets/modifiersIcons/products/${product.ID}.png`,
        productDescription: "Requiere para activarse:",
        cost: product.cost,
        products: product.requirements.map((req) => ({
            icon: `/assets/modifiersIcons/products/${req}.png`,
            id: Number(req),
            title: product.name,
        })),
    }));

    // const originalBudget = actionPlanState.getBudget();
    // let potentialRemainingBudget = actionPlanState.getPotentialRemainingBudget();//pass to the index
    // if(potentialRemainingBudget === 0) actionPlanState.setPotentialRemainingBudget(originalBudget!);

    const potentialRemainingBudget = actionPlanState.getPotentialRemainingBudget();
    const alreadySelectedProducts = actionPlanState.getActionPlanSelectedProducts() || [];
    const alreadyAcquiredProducts =
        actionPlanState.getAlreadyAcquiredModifiers().products;

    return json({
        tileProducts,
        potentialRemainingBudget,
        alreadySelectedProducts,
        alreadyAcquiredProducts
    });
};
export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const selectedProducts = formData.get("selectedProducts");
    const remainingBudget = formData.get("remainingBudget");
    const parsedProducts = JSON.parse(selectedProducts as string) as string[];

    actionPlanState.updateProductPlan(parsedProducts); //dont forget to reset the state after triggering the submit_actionplan event
    actionPlanState.updateBudget(Number(remainingBudget));
    console.log("selectedProducts", selectedProducts);
    console.log(parsedProducts);
    console.log("remainingBudget", remainingBudget);
    return json({ parsedProducts, remainingBudget });
};

const calculateTotalCost = ( selectedProducts: string[], tileProducts:BuyProductTableTileData[]) => {
    const total = selectedProducts.reduce(
        (acc, productId) =>
            acc +
            (tileProducts.find((product) => product.id === productId)?.cost || 0),
        0
    );
    return total;
}

export default function BuyProducts() {
    const { alreadyAcquiredProducts, tileProducts, potentialRemainingBudget,alreadySelectedProducts } = useLoaderData<typeof loader>();
    const maxProductsPerMonth = 5;
    const [previousTotal, setPreviousTotal] = useState(calculateTotalCost(alreadySelectedProducts, tileProducts));
    const [totalCost, setTotalCost] = useState<number>(calculateTotalCost(alreadySelectedProducts, tileProducts));
    const [selectedProducts, setSelectedProducts] = useState<string[]>(alreadySelectedProducts);
    const [potentialRemainingBudgetState, setPotentialRemainingBudgetState] = useState(potentialRemainingBudget);

    const [isModalOpen, setIsModalOpen] = useState(true);

    const surpassMaxProducts = selectedProducts.length > maxProductsPerMonth;
    const surpassBudget = totalCost > potentialRemainingBudgetState; //
    // let localRemainingBudget:number

    const fetcher = useFetcher();
    const navigate = useNavigate();

    useEffect(() => {
        if (fetcher.data) {
            console.log(fetcher.data);
            navigate(-1);
        }
    }, [fetcher.data, navigate]);

    // Calcula totalCost y remainingBudget cada vez que selectedProducts cambie
    useEffect(() => {
        const total = calculateTotalCost(selectedProducts, tileProducts);
        setTotalCost(total);
        // setPotentialRemainingBudgetState(budget! - total);
        // setPotentialRemainingBudgetState(potentialRemainingBudgetState - total);
        const updateDifference = previousTotal-total;
        const update_remainingBudget = potentialRemainingBudgetState + updateDifference;
        setPotentialRemainingBudgetState(update_remainingBudget);

        setPreviousTotal(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProducts, tileProducts]);

    const handleSubmit = () => {
        const data = JSON.stringify(selectedProducts);
        const formData = new FormData();
        formData.append("selectedProducts", data);
        formData.append("remainingBudget", potentialRemainingBudgetState.toString());
        fetcher.submit(formData, {
            method: "post",
        });
    };

    const handleSelectProduct = (productId: string) => {
        setSelectedProducts((prevSelected) => {
            if (prevSelected.includes(productId)) {
                return prevSelected.filter((id) => id !== productId);
            } else {
                return [...prevSelected, productId];
            }
        });
    };

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
    }
    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {isModalOpen && (
                <Modal
                    title="Compra productos"
                    onDismiss={handleDismiss}
                    type="back"
                >
                    <div className="flex flex-col gap-2">
                        <p className="space-y-4 px-5 py-4 font-rajdhani font-semibold text-lg leading-tight">
                            Objetos o mejoras que, una vez adquiridos te
                            ayudarán a ganar más puntos en futuras etapas.
                            {"\n"}
                            {`Recuerda que solo puedes comprar ${maxProductsPerMonth} productos por mes.`}
                        </p>
                        <div className="flex-grow max-h-[400px] overflow-y-auto scrollbar-thin flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-2">
                                {tileProducts.map((product) => {
                                    const alreadyAcquiredIds = alreadyAcquiredProducts.map(
                                        (product) => product.id
                                    );
                                    const alreadyAcquired = alreadyAcquiredIds.includes(product.id);
                                    return (
                                        <ModifierTabletTile
                                            key={product.title}
                                            tabletTileData={product}
                                            alreadyAcquiredProducts={alreadyAcquiredIds}
                                            // className="max-h-[110px]"
                                        >
                                            {(alreadyAcquired) && (
                                                    <div className="w-fit">
                                                        <img
                                                            src="/assets/icons/check.png"
                                                            alt="selected modifier"
                                                            className="size-6"
                                                        />
                                                    </div>
                                                )
                                            }

                                            {
                                                (selectedProducts.includes( product.id )) && (
                                                    <div className="w-fit">
                                                        <img
                                                            src="/assets/icons/check.png"
                                                            alt="selected modifier"
                                                            className="size-6"
                                                        />
                                                    </div>
                                                )
                                            }
                                            {/* <button
                                                className="flex items-center gap-2 border-2 border-zinc-900 bg-[#99C579] px-2 disabled:opacity-50 hover:scale-105 transform transition-transform duration-300"
                                                onClick={() =>
                                                    handleSelectProduct(
                                                        product.id
                                                    )
                                                }
                                                disabled={alreadyAcquired}
                                                title={
                                                    alreadyAcquired
                                                        ? "Ya tienes este producto"
                                                        : "Aún no tienes este producto"
                                                }
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
                                            </button> */}
                                            <CostButton
                                                alreadyAcquired={alreadyAcquired}
                                                product={{ id: product.id, cost: product.cost }}
                                                handleSelectProduct={handleSelectProduct}//the id is sent in the callback
                                                modifierType="products"
                                            ></CostButton>
                                            {/* <span className="text-green-500">
                                                {product.cost}
                                        </span> */}
                                        </ModifierTabletTile>
                                    );
                                })}
                            </div>
                            <div className="flex justify-end">
                                <div className=" max-w-[400px] flex flex-col gap-2 items-end">
                                    <div className="flex gap-2 w-fit">
                                        <span className="font-easvhs text-lg">
                                            Total de productos:
                                        </span>
                                        <span
                                            className={twMerge(
                                                "font-easvhs text-xl",
                                                surpassMaxProducts
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            )}
                                        >
                                            {selectedProducts.length}/ max(
                                            {maxProductsPerMonth})
                                        </span>
                                    </div>
                                    <div className="flex gap-2 w-fit">
                                        <span className="font-easvhs text-xl">
                                            Presupuesto restante:
                                        </span>
                                        <div className="flex items-center gap-2 border-2 border-zinc-900 bg-zinc-300 px-2">
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
                                                {potentialRemainingBudgetState}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-fit">
                                        <span className="font-easvhs text-2xl">
                                            Total:
                                        </span>
                                        <div className="flex items-center gap-2 border-2 border-zinc-900 bg-[#99C579] px-2">
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
                                                {totalCost}
                                            </span>
                                        </div>
                                    </div>
                                    <Button2
                                        className="btn btn-primary font-easvhs text-zinc-50 text-xl w-80 disabled:opacity-50 max-w-80 max-h-14"
                                        onClick={handleSubmit}
                                        disabled={
                                            surpassBudget || surpassMaxProducts
                                        }
                                    >
                                        Enviar
                                    </Button2>
                                </div>
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
