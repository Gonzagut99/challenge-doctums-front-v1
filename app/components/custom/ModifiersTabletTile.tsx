import { twMerge } from "tailwind-merge";
import { ModifiersTabletTileData } from "~/types/modifiers";

interface TabletTileProps extends React.HTMLProps<HTMLDivElement> {
    children?: React.ReactNode;
    className?: string;
    tabletTileData: ModifiersTabletTileData;
    alreadyAcquiredProducts?: string[];
}

export function ModifierTabletTile({ children,className, tabletTileData, alreadyAcquiredProducts, ...rest }: TabletTileProps) {
    // const alreadyAcquiredProductsTest = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '15', '20', '25'];
  return (
    <div {...rest} className={twMerge("p-2 flex gap-2 bg-slate-50 rounded-md border-[3px] border-zinc-900 min-w-[372px]", className)} >
        <img src={tabletTileData.icon} alt="TabletTile" className="object-fill size-16"/>
        <div className="relative grow h-full flex flex-col">
            <header>
                <p className="font-easvhs text-sm line-clamp-2">
                    {tabletTileData.title}
                </p>
            </header>
            <div className="font-rajdhani h-full">
                <p className="text-xs font-semibold">{tabletTileData.productDescription}</p>
                <div className="grid grid-cols-2 h-full pb-3">
                    <div className="flex gap-1 flex-wrap h-fit">
                    {
                        tabletTileData.products.map((product) => (
                            <figure key={product.id} className="w-fit relative">
                                {/* <figcaption className="text-[10px] font-easvhs">{product.title}</figcaption> */}
                                {
                                    (alreadyAcquiredProducts ?? []).includes(product.id.toString()) && <div className="w-fit z-10 absolute inset-0 backdrop-blur-0 bg-zinc-50/50">
                                        <img className="size-5" src="/assets/icons/check.png" alt="Already baought" title="Producto ya adquirido"/>
                                    </div>
                                }
                                <img className="object-fill size-5" src={product.icon} alt={`Producto ${product.id}`} title={product.title}/>
                            </figure>
                        ))
                    }
                    {
                        tabletTileData.products.length === 0 && (
                            <span className="text-sm font-rajdhani font-semibold opacity-50 pt-2">Ninguno</span>
                        )
                    }
                    </div>
                    <div className="flex items-end justify-end gap-2">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}