export type SubmitPlanResponse = {
    method: string;
    status: string;
    bought_modifiers: {[key: string]: string};
    player: ActionPlanPlayerState;
}

export type ActionPlanPlayerState = {
    budget: number;
    products: [{
        product_id: number;
        is_enabled: boolean;
        purchased_requirements: string[];
    }];
    projects:[{
        project_id: number;
        remaining_time: number;
    }];
    resources:[{
        resource_id: number;
        remaining_time: number;
    }];
}

export type PlanActions = {
    products: string[], //Van los ids  en string "products": ["10", "11"],
    projects: string[],
    resources: string[],
}

// export type SubmitPlanResponse = {
//     method: string;
//     status: string;
//     bought_modifiers: {[key: string]: string};
//     player:{
//         budget: number;
//         products: [{
//             product_id: number;
//             is_enabled: boolean;
//             purchased_requirements: string[];
//         }];
//         projects:[{
//             project_id: number;
//             remaining_time: number;
//         }];
//         resources:[{
//             resource_id: number;
//             remaining_time: number;
//         }];
//     }
// }



