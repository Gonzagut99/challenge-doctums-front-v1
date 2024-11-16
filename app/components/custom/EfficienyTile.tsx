import { twMerge } from "tailwind-merge";

interface EfficiencyPointsTileProps extends React.HTMLProps<HTMLDivElement> {
    title: string;
    className?: string;
    points?: number;
}
export function EfficiencyPointsTile({ points, title, className, ...rest }: EfficiencyPointsTileProps) {
    return (
        <div {...rest} className={twMerge("flex gap-2 items-start font-easvhs border-[3px] border-zinc-900 rounded-sm p-1", className)}>
            <img src="/assets/icons/efficiencyIcon.png" alt="Efficiency Icon" className="size-8"/>
            <p className="text-[13px]">
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