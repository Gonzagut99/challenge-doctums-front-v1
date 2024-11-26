// import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ConsequenceBadge } from "~/components/custom/ConsequenceBadge";
import { EfficiencyPointsTile } from "~/components/custom/EfficienyTile";
import {
    ModifiersSmallTile,
    ProductTileData,
} from "~/components/custom/ModifiersSmallTile";
import SmallModal from "~/components/custom/SmallModal";
import { globalWebSocketService } from "~/services/ws";
import { loadEfficiencies, loadProducts } from "~/utils/dataLoader";

// export type GameStartMessage = {
//     method: string;
//     status: string;
//     message: string;
//     current_turn: string;
//     legacy_products: string[];
//     player: PlayerInitState;
//     turns_order: StartGameTurnPlayerOrder[];
//     is_start_game_stage:boolean;
//     show_legacy_modal:boolean;
//   }
  
//   export type PlayerInitState = {
//     id: string;
//     name: string;
//     avatarId: string;
//     budget: number;
//     score: number;
//     efficiencies: Efficiencies;
//   }
  
//   type Efficiencies = {
//     [key: string]: number;
//   }
  
//   export type StartGameTurnPlayerOrder = {
//     playerId: string;
//     name: string;
//     avatarId: string;
//     dices: number[];
//     total: number;
//   }

// interface EfficiencyPointsTileProps extends React.HTMLProps<HTMLDivElement> {
//     title: string;
//     className?: string;
//     points?: number;
// }

// interface ProductTileProps extends React.HTMLProps<HTMLDivElement> {
//     modifierTileData: ProductTileData|ProjectTileData|ResourceTileData,
//     type: "product"|"project"|"resource"
// }

// export type ProductTileData = {
//     product_id: string;
//     src:string
//     title: string;
//     is_enabled: boolean;
//     purchased_requirements: string[];
//     all_requirements: {
//         id: string;
//         title: string;
//         src:string
//     }[];
// }

export const loader = async () => {
    const domainProducts = await loadProducts('app/data/products.csv');
    //const startGameResponse = globalWebSocketService.getResponseWhenGameStarted();
    const efficiencies = globalWebSocketService.localPlayerEfficiencies;
    const efficiencyDomainData = await loadEfficiencies('app/data/efficiencies.csv');
    const currentPlayerProducts = globalWebSocketService.localPlayerModifiers.products;
    const currentLocalPlayerData = globalWebSocketService.getLocalPlayerDynamicInfo();
    const playersProductsIds = currentPlayerProducts.map((product) => product.id);
    const productTileData: ProductTileData[] = currentPlayerProducts.map((product) => {
        const productData = domainProducts[product.id];
        const isEnabled = productData.requirements.every((requirement) =>
            playersProductsIds.includes(requirement)
        );
        return {
            product_id: product.id,
            src: `/assets/modifiersIcons/products/${product.id}.png`,
            title: productData.name,
            is_enabled: isEnabled,
            purchased_requirements: playersProductsIds,
            all_requirements: productData.requirements.map((requirement) => ({
                id: requirement,
                title: domainProducts[requirement].name,
                src: `/assets/modifiersIcons/products/${requirement}.png`,
            })),
        }
    })

    return json({
        //currentPlayerProducts,
        productTileData,
        efficiencies,
        currentLocalPlayerData,
        efficiencyDomainData,
    });
};
export default function LegacyRewards() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const navigate = useNavigate();

    function handleDismiss() {
        setIsModalOpen(false);
    }

    function handleExitComplete() {
        navigate(-1);
    }

    const { productTileData, efficiencies, currentLocalPlayerData, efficiencyDomainData } =
        useLoaderData<typeof loader>();
  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
    {isModalOpen && (
        <SmallModal onDismiss={handleDismiss} className="w-[500px] h-[540px] py-2">
            <div className="px-2 flex flex-col space-y-4">
                <h1 className="text-2xl font-easvhs flex gap-2 justify-center">
                    Listo para comenzar
                    <span>
                        <img
                            className="size-7"
                            src="/assets/icons/celebrationIcon.png"
                            alt="Celebrate"
                        />
                    </span>
                </h1>
                <div className="flex flex-col gap-1 text-center">
                    <p className="text-base font-rajdhani font-semibold leading-tight">
                        Para no comenzar de cero, aquí te damos algunos productos, así como, un <span className="font-black">presupuesto inical</span> de 100,000 dólares.
                    </p>
                    <p className="font-rajdhani font-semibold leading-tight text-base">
                        Además, se te dan <span className="font-black">5 puntos</span> en las eficiencias que pueden ser modificadas por algún producto inicial que recibas.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 justify-center">
                        <ConsequenceBadge type="success" variant="budget">
                            <span>{currentLocalPlayerData?.budget}</span>
                        </ConsequenceBadge>
                        <ConsequenceBadge type="success" variant="score">
                            <span>{currentLocalPlayerData?.score}</span>
                        </ConsequenceBadge>
                    </div>
                    <div className="flex flex-col gap-2 h-[260px] max-h-[260px] overflow-auto scrollbar-thin">
                        {productTileData.length > 0 && (
                            <div>
                                <h3 className="text-lg font-easvhs">
                                    Lista actualizada de tus productos
                                </h3>
                                <div className="flex flex-col gap-1">
                                    {productTileData.map((product) => (
                                        <ModifiersSmallTile
                                            key={product.product_id}
                                            modifierTileData={product}
                                            type="product"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {
                            Object.values(efficiencies).length > 0 && (
                                <div>
                                    <h3 className="text-lg font-easvhs">
                                        Eficiencias modificadas
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        {Object.entries(efficiencies).map(([efficiencyId, points]) => {
                                            if (points === 0) return null;
                                            return (
                                                <EfficiencyPointsTile
                                                    key={efficiencyId}
                                                    title={efficiencyDomainData[efficiencyId].name}
                                                    points={points}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </SmallModal>
    )}
</AnimatePresence>
  )
}


