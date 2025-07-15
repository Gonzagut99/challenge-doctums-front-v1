import { useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import SmallModal from "~/components/custom/SmallModal";

interface EventFailureModalData {
    budget: number;
    score: number;
}
export default function WidgetDetailRoute() {
    //const { widget } = useLoaderData<typeof loader>();
    const { budget, score }: EventFailureModalData = {
        budget: 200,
        score: 50,
    };

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
                        Esta vez fallaste 😒
                    </h1>
                    <p className="text-lg font-easvhs max-w-96 text-center">
                        Has perdido el evento y no has ganado puntos de
                        eficiencia
                    </p>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 justify-center">
                            <ConsequenceBadge type="failure" variant="budget">
                                <span>{budget}</span>
                            </ConsequenceBadge>
                            <ConsequenceBadge type="failure" variant="score">
                                <span>{score}</span>
                            </ConsequenceBadge>
                        </div>
                    </div>
                </SmallModal>
            )}
        </AnimatePresence>
    );
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    type: "success" | "failure" | "neutral";
    variant?: "budget" | "score" | "custom";
    img?: string;
    twBgColor?: string;
    children?: React.ReactNode;
    classname?: string;
}
export function ConsequenceBadge({
    img,
    twBgColor,
    type,
    children,
    className,
    variant,
    ...rest
}: BadgeProps) {
    let finalImage;
    let finalBgColor;
    switch (variant) {
        case "budget":
            finalImage = img || "/assets/icons/cashIcon.png";
            finalBgColor = twBgColor || "bg-[#99C579]";
            break;
        case "score":
            finalImage = img || "/assets/icons/scoreIcon.png";
            finalBgColor = twBgColor || "bg-[#FEE559]";
            break;
        default:
            finalImage = img || "/assets/icons/cashIcon.png";
            finalBgColor = twBgColor || "bg-[#99C579]";
            break;
    }

    return (
        <div
            {...rest}
            className={twMerge(
                "flex items-center gap-2 border-2 border-zinc-900 px-2",
                finalBgColor,
                className
            )}
        >
            <figure className={"px-1 h-full flex items-center w-fit"}>
                <img src={finalImage} alt="Icon" className="size-6" />
            </figure>
            <span className="font-easvhs text-lg">
                {type === "success" && "+ "}
                {type === "failure" && "- "}
                {children}
            </span>
            {/* <EfficiencyPointsTile points={}> */}
        </div>
    );
}
