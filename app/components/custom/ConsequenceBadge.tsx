import { twMerge } from "tailwind-merge";

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
