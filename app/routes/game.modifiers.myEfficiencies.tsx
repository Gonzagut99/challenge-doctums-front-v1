// import type { LoaderFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MyEfficiencyTabletTile } from "~/components/custom/EfficiencyTabletTile";
import Modal from "~/components/custom/Modal";
import { getWebSocketService, WebSocketService } from "~/services/ws";
import { EfficiencyTableTileData } from "~/types/efficiencies";
import { initializedDataLoader } from "~/utils/dataLoader";

// export interface EfficiencyTableTileData {
//     id: number;
//     title: string;
//     description: string;
//     icon: string;
// }

// type StreamedEfficiencyData = {
//     [key: string]: number;
// }

// const myStreamedEfficiencyData: StreamedEfficiencyData = {
//     '1': 0,
//     '2': 0,
//     '3': 0,
//     '4': 0,
//     '5': 5,
//     '6': 0,
//     '7': 0,
//     '8': 10,
//     '9': 0,
//     '10': 0,
//     '11': 0,
//     '12': 0
//   }

// const efficiencies= await loadEfficiencies("app/data/efficiencies.csv");
// const myEfficiencies: EfficiencyTableTileData[] = Object.values(efficiencies).map((efficiency) => ({
//     id: efficiency.ID,
//     title: efficiency.name,
//     icon: `/assets/modifiersIcons/efficiencies/${efficiency.ID}.png`,
//     strength_score: myStreamedEfficiencyData[efficiency.ID],
// }));

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const sessionCode = url.searchParams.get("sessionCode") as string;
    const playerId = url.searchParams.get("playerId") as string;
    const globalWebSocketService = getWebSocketService(sessionCode, playerId) as WebSocketService ;

    // const efficiencies= await loadEfficiencies("app/data/efficiencies.csv");
    const efficiencies = initializedDataLoader.getEfficiencies();
    const myEfficienciesStrengthData = globalWebSocketService.localPlayerEfficiencies;
    const myEfficiencies: EfficiencyTableTileData[] = Object.values(efficiencies).map((efficiency) => ({
        id: efficiency.ID,
        title: efficiency.name,
        icon: `/assets/icons/efficiencyIcon.png`,
        strength_score: myEfficienciesStrengthData[efficiency.ID],
    }));
    return json({ myEfficiencies });
};


export default function EfficiencyModal() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const data = useLoaderData<typeof loader>();
    const myEfficiencies = data.myEfficiencies;
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
        <Modal title="Tus Eficiencias" onDismiss={handleDismiss}>
            <div className="flex flex-col gap-2">
                <p className="space-y-4 px-5 py-4 font-semibold font-rajdhani leading-snug text-lg">¿Cómo va avanzando tu empresa? Los puntos de fortaleza de tus eficiencias muestran si estas preparado para enfrentar eventos de mayor dificultad.</p>
                <div className="flex-grow max-h-[410px] overflow-y-auto scrollbar-thin">
                    <div className="grid grid-cols-2 gap-2">
                        {
                            myEfficiencies.map((efficiency) => {
                                return (
                                    <MyEfficiencyTabletTile key={efficiency.title} tabletTileData={efficiency}>
                                    </MyEfficiencyTabletTile>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </Modal>
    )}
    </AnimatePresence>
  )
}