import { twMerge } from "tailwind-merge";
import { EfficiencyTableTileData } from "~/types/efficiencies";

interface TabletTileProps extends React.HTMLProps<HTMLDivElement> {
    // children?: React.ReactNode;
    className?: string;
    tabletTileData: EfficiencyTableTileData;
}

export function MyEfficiencyTabletTile({ className, tabletTileData, ...rest }: TabletTileProps) {
    const maxEficciencyStrengthScore = 36;
  return (
    <div {...rest} className={twMerge("p-2 flex gap-2 bg-slate-50 rounded-md border-[3px] border-zinc-900 min-w-[372px]", className)} >
        <img src={tabletTileData.icon} alt="TabletTile" className="object-fill size-16"/>
        <div className="relative grow h-full flex flex-col">
            <header>
                <p className="font-easvhs text-sm line-clamp-2">
                    {tabletTileData.title}
                </p>
            </header>
            <div className="font-easvhs flex items-end justify-end grow">
                {/* <div>
                    <div className="flex gap-1 flex-wrap">
                    {
                        tabletTileData.products.map((product) => (
                            <img className="object-fill size-4" key={product.id} src={product.icon} alt={`Producto ${product.id}`} />
                        ))
                    }
                    </div>
                    <div className="flex items-end justify-end">
                        {children}
                    </div>
                    
                </div> */}
                <div className="flex w-fit">
                        <span className=" font-dogica-bold text-lg">{tabletTileData.strength_score}/{maxEficciencyStrengthScore}</span>
                    </div>
            </div>
        </div>
    </div>
  )
}