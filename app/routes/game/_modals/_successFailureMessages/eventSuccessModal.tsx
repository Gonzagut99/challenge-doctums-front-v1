import { useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ConsequenceBadge } from "~/components/custom/ConsequenceBadge";
import { EfficiencyPointsTile } from "~/components/custom/EfficienyTile";
import SmallModal from "~/components/custom/SmallModal";

interface EfficiencyFeatureTileData {
    id: string;
    title: string;
    points: number;
}

interface EventSuccessModalData {
    budget: number;
    score: number;
    efficiencyPoints: EfficiencyFeatureTileData[] | null;
}

export default function WidgetDetailRoute() {
    const { budget, score, efficiencyPoints }: EventSuccessModalData = {
        budget: 1000,
        score: 100,
        efficiencyPoints: [
            {
                id: "1",
                title: "Eficiencia 1",
                points: 10,
            },
            {
                id: "2",
                title: "Eficiencia 2",
                points: 20,
            },
            {
                id: "3",
                title: "Eficiencia 3",
                points: 30,
            },
        ],
    };

    // const [open, setOpen] = useState(true);
    // const handleClose = () => {
    //     setOpen(false);
    //     navigate(-1);
    // };

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
                <SmallModal onDismiss={handleDismiss}>
                    <h1 className="text-2xl font-easvhs flex gap-2">
                        ¡FELICIDADES!
                        <span>
                            <img
                                className="size-7"
                                src="/assets/icons/celebrationIcon.png"
                                alt="Celebrate"
                            />
                        </span>
                    </h1>
                    <p className="text-lg font-easvhs">Has ganado el evento</p>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 justify-center">
                            <ConsequenceBadge type="success" variant="budget">
                                <span>{budget}</span>
                            </ConsequenceBadge>
                            <ConsequenceBadge type="success" variant="score">
                                <span>{score}</span>
                            </ConsequenceBadge>
                        </div>
                        {efficiencyPoints && (
                            <div>
                                <h3 className="text-lg font-easvhs">
                                    Ahora tu(s) eficiencia(s) tiene(n)
                                </h3>
                                <div className="flex flex-col gap-1 h-[100px] max-h-[80px] overflow-auto scrollbar-thin">
                                    {efficiencyPoints.map((efficiencyPoint) => (
                                        <EfficiencyPointsTile
                                            key={efficiencyPoint.id}
                                            points={efficiencyPoint.points}
                                            title={efficiencyPoint.title}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </SmallModal>
            )}
        </AnimatePresence>
    );
}
