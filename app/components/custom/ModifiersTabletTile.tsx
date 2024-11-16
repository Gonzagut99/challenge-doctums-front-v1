import { twMerge } from "tailwind-merge";
import { ModifiersTabletTileData } from "~/types/modifiers";

interface TabletTileProps extends React.HTMLProps<HTMLDivElement> {
    children?: React.ReactNode;
    className?: string;
    tabletTileData: ModifiersTabletTileData;
}

export function ModifierTabletTile({ children,className, tabletTileData, ...rest }: TabletTileProps) {
  return (
    <div {...rest} className={twMerge("p-2 flex gap-2 bg-slate-50 rounded-md border-[3px] border-zinc-900 min-w-[372px]", className)} >
        <img src={tabletTileData.icon} alt="TabletTile" className="object-fill size-16"/>
        <div className="relative grow h-full flex flex-col">
            <header>
                <p className="font-easvhs text-sm line-clamp-2">
                    {tabletTileData.title}
                </p>
            </header>
            <div className="font-easvhs h-full">
                <p className="text-[10px]">{tabletTileData.productDescription}</p>
                <div className="grid grid-cols-2 h-full pb-3">
                    <div className="flex gap-1 flex-wrap h-fit">
                    {
                        tabletTileData.products.map((product) => (
                            <img className="object-fill size-5" key={product.id} src={product.icon} alt={`Producto ${product.id}`} title={product.title}/>
                        ))
                    }
                    {
                        tabletTileData.products.length === 0 && (
                            <span className="text-[10px] font-easvhs opacity-50 pt-2">Ninguno</span>
                        )
                    }
                    </div>
                    <div className="flex items-end justify-end">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}