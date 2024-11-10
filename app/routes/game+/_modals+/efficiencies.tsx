import { useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "~/components/custom/Modal";

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

function EfficiencyModal() {
    const [isModalOpen, setIsModalOpen] = useState(true);

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
        <Modal title="My modal" onDismiss={handleDismiss}>
            <div className="flex flex-col gap-2">
                <p className="space-y-4 px-5 py-4 font-easvhs text-lg">Misiones o tareas que, al pasar tres meses te otorgan productos</p>
                <div className="grid grid-cols-2">
                    {

                    }
                </div>
            </div>

        </Modal>
    )}
    </AnimatePresence>
  )
}

export default EfficiencyModal