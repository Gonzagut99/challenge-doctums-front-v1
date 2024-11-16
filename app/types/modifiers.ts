export interface ModifierFeature {
    icon: string;
    id: number;
    title:string;
}

export interface ProductFeature extends ModifierFeature{
}

export interface ModifiersTabletTileData{
    title: string;
    icon: string;
    productDescription: 'Productos a producir:' | 'Productos a desarrollar:' | 'Requiere:';
    products: ProductFeature[];
}

export interface MyProductTableTileData extends ModifiersTabletTileData{
    enabled:boolean;
}
export interface BuyProductTableTileData extends ModifiersTabletTileData{
    cost: number;
}

export interface BuyProjectTableTileData extends ModifiersTabletTileData{
    cost: number;
}

export interface BuyResourceTableTileData extends ModifiersTabletTileData{
    cost: number;
}