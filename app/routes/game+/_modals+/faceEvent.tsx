// import type { LoaderFunctionArgs } from "@remix-run/node";
// import { json, useLoaderData, useNavigate } from "@remix-run/react";
// import { AnimatePresence } from "framer-motion";
// import { useState } from "react";
// import { MyEfficiencyTabletTile } from "~/components/custom/EfficiencyTabletTile";
// import Modal from "~/components/custom/Modal";
// import { EfficiencyTableTileData } from "~/types/efficiencies";
// import { loadEvents } from "~/utils/dataLoader";

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//     const events = await loadEvents("app/data/events.csv");
//     // const myEfficiencies: EfficiencyTableTileData[] = Object.values(efficiencies).map((efficiency) => ({
//     //     id: efficiency.ID,
//     //     title: efficiency.name,
//     //     icon: `/assets/icons/efficiencyIcon.png`,
//     //     strength_score: myStreamedEfficiencyData[efficiency.ID],
//     // }));
//     return json({ events });
// };

// export default function FaceEvent() {
//     const [isModalOpen, setIsModalOpen] = useState(true);

//     const data = useLoaderData<typeof loader>();
//     console.log(data)
//     // const myEfficiencies = data.myEfficiencies;
//     const navigate = useNavigate();

//     function handleDismiss() {
//         setIsModalOpen(false);
//     }

//     function handleExitComplete() {
//         navigate(-1);
//     }
//   return (
//     <AnimatePresence onExitComplete={handleExitComplete}>
//     {isModalOpen && (
//         <Modal title="Tus Eficiencias" onDismiss={handleDismiss}>
//             <div className="flex flex-col gap-2">
//                 <p className="space-y-4 px-5 py-4 font-easvhs text-lg">Misiones o tareas que, al pasar tres meses te otorgan productos</p>
//                 <div className="flex-grow max-h-[430px] overflow-y-auto scrollbar-thin">
//                     {/* <div className="grid grid-cols-2 gap-2">
//                         {
//                             myEfficiencies.map((efficiency) => {
//                                 return (
//                                     <MyEfficiencyTabletTile key={efficiency.title} tabletTileData={efficiency}>
//                                     </MyEfficiencyTabletTile>
//                                 )
//                             })
//                         }
//                     </div> */}
//                 </div>
//             </div>

//         </Modal>
//     )}
//     </AnimatePresence>
//   )
// }

// // export interface EfficiencyTableTileData {
// //     id: number;
// //     title: string;
// //     description: string;
// //     icon: string;
// // }

// // type StreamedEfficiencyData = {
// //     [key: string]: number;
// // }

// // const myStreamedEfficiencyData: StreamedEfficiencyData = {
// //     '1': 0,
// //     '2': 0,
// //     '3': 0,
// //     '4': 0,
// //     '5': 5,
// //     '6': 0,
// //     '7': 0,
// //     '8': 10,
// //     '9': 0,
// //     '10': 0,
// //     '11': 0,
// //     '12': 0
// //   }

// // const efficiencies= await loadEfficiencies("app/data/efficiencies.csv");
// // const myEfficiencies: EfficiencyTableTileData[] = Object.values(efficiencies).map((efficiency) => ({
// //     id: efficiency.ID,
// //     title: efficiency.name,
// //     icon: `/assets/modifiersIcons/efficiencies/${efficiency.ID}.png`,
// //     strength_score: myStreamedEfficiencyData[efficiency.ID],
// // }));
