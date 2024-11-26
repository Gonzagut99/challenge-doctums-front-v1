import { twMerge } from "tailwind-merge";

export type ProductTileData = {
    product_id: string;
    src:string
    title: string;
    is_enabled: boolean;
    // purchased_requirements: {
    //     id: string;
    //     title: string;
    //     src:string
    // }[];
    purchased_requirements: string[];
    all_requirements: {
        id: string;
        title: string;
        src:string
    }[];
}

export type ProjectTileData = {
    project_id: string;
    title: string;
    remaining_time: number;
}

export type ResourceTileData = {
    resource_id: string;
    title: string;
    remaining_time: number;
}

interface ProductTileProps extends React.HTMLProps<HTMLDivElement> {
    modifierTileData: ProductTileData|ProjectTileData|ResourceTileData,
    type: "product"|"project"|"resource"
}

export const ModifiersSmallTile = ({
    modifierTileData,
     type,
     ...rest
}:ProductTileProps) => {
    if (type === "product") {
        const {is_enabled, purchased_requirements, title, all_requirements, src} = modifierTileData as ProductTileData;
        return (
            <div className={twMerge("flex gap-2 items-start font-easvhs border-[3px] border-zinc-900 rounded-sm p-1 justify-between", rest.className)} {...rest}>
                <div className="flex gap-2 items-start">
                    <img src={src} alt="Efficiency Icon" className="size-8"/>
                    <p className="text-base line-clamp-2 font-rajdhani font-semibold">
                        { title }
                    </p>
                </div>
                <div className="flex flex-col gap-1">
                    {
                        is_enabled && (
                        <div className="flex items-end">
                            <p className="text-lg font-bold text-green-600">
                                { "Activado" }
                            </p>
                        </div>
                        )
                    }
                    {
                        <div className="flex items-end gap-1 flex-wrap">
                            {all_requirements.map((requirement) => (
                                <div key={requirement.id} className="relative">
                                    {
                                        purchased_requirements.includes(requirement.id)&&<div className="size-4 w-fit absolute inset-0 backdrop-blur-0 bg-white/70 z-10"><img src="/assets/icons/check.png" alt="Adquirido" className="size-4 object-contain"/></div>
                                    }
                                    <img src={requirement.src} alt="Requirement Icon" className="size-4" title={requirement.title}/>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        )
    } else {
        const { remaining_time, title } = modifierTileData as ProjectTileData|ResourceTileData;
        const maxTime = type === "project"? 3: 1;
        return <div className={twMerge("flex gap-2 items-start font-easvhs border-[3px] border-zinc-900 rounded-sm p-1 justify-between", rest.className)} {...rest} >
            <div className="flex gap-2 items-start">
                <img src={type == 'project'? "/assets/icons/projectsIcon.png": "/assets/icons/resourcesIcon.png"} alt="Modifier Icon" className="size-8"/>
                <p className="text-base line-clamp-2 font-rajdhani font-semibold">
                    { title}
                </p>
            </div>
            {
                remaining_time && (
                    <div className="h-full flex items-center">
                    <p className="text-lg font-bold">
                        { maxTime-remaining_time }/{maxTime}
                    </p>
                </div>
                )
            }
        </div>
    }
}