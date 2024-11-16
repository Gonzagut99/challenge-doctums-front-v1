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



