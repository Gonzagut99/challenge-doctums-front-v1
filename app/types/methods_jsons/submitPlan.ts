
export type SubmitPlanResponse = {
    method: string;
    status: string;
    message: string;
    current_turn: string;
    bought_modifiers: {[key: string]: string[]};
    player: ActionPlanPlayerState;
    show_modal: boolean;
    is_ready_to_face_event: boolean;
}

export type ActionPlanPlayerState = {
    budget: number;
    products: [{
        product_id: string;
        is_enabled: boolean;
        purchased_requirements: string[];
    }];
    projects:[{
        project_id: string;
        remaining_time: number;
    }];
    resources:[{
        resource_id: string;
        remaining_time: number;
    }];
}

export type PlanActions = {
    products: string[], //Van los ids  en string "products": ["10", "11"],
    projects: string[],
    resources: string[],
}

export type LocalPlayerModifiers = {
    products: [
        {
            id: string;
            is_enabled: boolean;
            was_bought: boolean;
            purchased_requirements: string[];
        }
    ],
    projects:[{
        id: string;
        remaining_time: number;
    }];
    resources:[{
        id: string;
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



