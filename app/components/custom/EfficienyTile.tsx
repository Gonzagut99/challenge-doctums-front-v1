import { twMerge } from "tailwind-merge";

interface EfficiencyPointsTileProps extends React.HTMLProps<HTMLDivElement> {
    title: string;
    className?: string;
    points?: number;
}
export function EfficiencyPointsTile({ points, title, className, ...rest }: EfficiencyPointsTileProps) {
    return (
        <div {...rest} className={twMerge("flex gap-2 items-start justify-between font-easvhs border-[3px] border-zinc-900 rounded-sm p-1", className)}>
            <div className="flex gap-2 items-start" title={title}>
                <img src="/assets/icons/efficiencyIcon.png" alt="Efficiency Icon" className="size-8"/>
                <p className="text-base line-clamp-2 font-rajdhani font-semibold leading-tight">
                    { title }
                </p>
            </div>
            <div>
                {
                    points && (
                        <div className="h-full flex items-center">
                        <p className="text-lg font-semibold">
                            { points }
                        </p>
                    </div>
                    )
                }
            </div>
        </div>
    );
}

interface ChallengeEfficiencyPointsTileProps extends EfficiencyPointsTileProps {
    chosen: boolean;
}

export function ChallengeEfficiencyPointsTile({ points, title, className, chosen, ...rest }: ChallengeEfficiencyPointsTileProps) {
    return (
        <div {...rest} className={twMerge("flex gap-2 items-start font-easvhs border-[3px] border-zinc-900 rounded-sm p-1 relative", className)}>
            {!chosen&&<div className="absolute w-full h-full backdrop-grayscale bg-zinc/30"></div>}
            <img src="/assets/icons/efficiencyIcon.png" alt="Efficiency Icon" className="size-8"/>
            <p className="text-base line-clamp-2 font-rajdhani font-semibold leading-tight">
                { title }
            </p>
            {
                points && (
                    <div className="h-full flex items-center">
                    <p className="text-lg font-bold">
                        { points }
                    </p>
                </div>
                )
            }
        </div>
    );
}