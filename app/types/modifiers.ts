export type ProductFeature = {
    icon: string;
    id: number;
}

export interface ModifiersTabletTileData{
    title: string;
    icon: string;
    productDescription: 'Productos a producir:' | 'Productos a desarrollar:' | 'Requiere:';
    products: ProductFeature[];
}