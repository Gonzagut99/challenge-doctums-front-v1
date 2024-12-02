// import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "~/components/custom/Modal";
import { initializedDataLoader } from "~/utils/dataLoader";

export interface EventTableTileData {
    id: string;
    description: string;
    level: number;
    icon: string;
}

export const loader = async () => {
    const domainEvents = initializedDataLoader.getEvents();
    const events: EventTableTileData[] = Object.values(domainEvents).map((event) => ({
        id: event.ID,
        description: event.description,
        level: event.level,
        icon: `/assets/icons/productsIcon.png`,
    }));
    return json({ events });
};

export default function EventDetail() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const data = useLoaderData<typeof loader>();
    const events = data.events;
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
        <Modal title={"Eventos"} onDismiss={handleDismiss}>
            <div className="flex flex-col gap-2">
                <p className="space-y-4 px-5 py-4 font-rajdhani leading-tight font-semibold text-lg">Aqui encontrarás toda la lista de eventos para planificar tu estrategia.</p>
                <div className="flex-grow max-h-[430px] overflow-y-auto scrollbar-thin">
                    <div className="grid grid-cols-2 gap-2">
                        {
                            events.map((event) => {
                                return (
                                    <Link key={event.id} to={`/game/events/${event.id}`}>
                                        <EventTile tabletTileData={event} className="transform hover:scale-105 transition-transform duration-200">
                                        </EventTile>
                                    </Link>
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

interface EventTileProps extends React.HTMLProps<HTMLDivElement> {
    tabletTileData: EventTableTileData;
}
export function EventTile({ tabletTileData , ...rest }: EventTileProps) {
    return (
        <div {...rest} className="!basis-1/2 flex gap-2 items-center font-easvhs border-[3px] border-zinc-900 rounded-sm p-1 bg-zinc-50 h-fit">
            <img src={tabletTileData.icon} alt="Efficiency Icon" className="size-8"/>
            <div className="flex flex-col">
                <p className="text-base">
                    { `Evento ${tabletTileData.id}` }
                </p>
                <span className="line-clamp-2 text-[10px]">
                    { tabletTileData.description }
                </span>
            </div>
        </div>
    );
}



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
