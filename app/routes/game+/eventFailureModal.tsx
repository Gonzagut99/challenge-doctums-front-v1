import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button2 } from "~/components/custom/Button2";
import { WhiteContainer } from "~/components/custom/WhiteContainer";
import {
    Dialog
} from "~/components/ui/dialog";


interface EventFailureModalData{
    budget: number;
    score: number;
}
export default function WidgetDetailRoute() {
    //const { widget } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const { budget, score } : EventFailureModalData = {
        budget: 200,
        score: 50
    };

    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        navigate(-1);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            {/* <DialogContent className="sm:max-w-[425px]"> */}
            {/* <DialogHeader>
            <DialogTitle>Widget</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              {widget.widgetName}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              {widget.widgetNumber}
            </div>
            Hola
          </div>
        </DialogContent> */}
            <WhiteContainer className="min-w-60">
                <div className="flex flex-col gap-2 items-center py-4">
                    <h1 className="text-2xl font-easvhs flex gap-2">Esta vez fallaste 😒</h1>
                    <p className="text-lg font-easvhs max-w-96 text-center">Has perdido el evento y no has ganado puntos de eficiencia</p>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 justify-center">
                            <ConsequenceBadge
                                type="failure"
                                variant="budget"
                            >
                                <span>{budget}</span>
                            </ConsequenceBadge>
                            <ConsequenceBadge
                                type="failure"
                                variant="score"
                            >
                                <span>{score}</span>
                            </ConsequenceBadge>
                        </div>
                    </div>
                    <Button2 className="text-zinc-50 h-10" onClick={handleClose}>Aceptar</Button2>
                </div>
            </WhiteContainer>
        </Dialog>
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
export function ConsequenceBadge({ img, twBgColor, type, children,  className, variant, ...rest}:BadgeProps ) {
    let finalImage
    let finalBgColor
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
            break
    }

    return <div {...rest} className={twMerge("flex items-center gap-2 border-2 border-zinc-900 px-2", finalBgColor, className)}>
        <figure className={"px-1 h-full flex items-center w-fit"}>
            <img
                src={finalImage}
                alt="Icon"
                className="size-6"
            />
        </figure>
        <span className="font-easvhs text-lg">
            {  type === "success" && "+ "}
            {   type === "failure" && "- " }
            {
                children
            }
        </span>
        {/* <EfficiencyPointsTile points={}> */}
    </div>;
}