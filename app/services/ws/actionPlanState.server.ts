import { PlanActions } from '~/types/methods_jsons';
import { LocalPlayerModifiers } from '~/types/methods_jsons/submitPlan';

export type ActionPlanStateMethods ={
    updatePlan: (
        plan: PlanActions
    ) => void,
    updateProductPlan: (
        products: string[]
    ) => void,
    updateProjectPlan: (
        projects: string[]
    ) => void,
    updateResourcesPlan: (
        resources: string[]
    ) => void,
    resetPlan: () => void,
    getActionPlan: () => PlanActions,
    getActionPlanSelectedProducts: () => string[],
    getActionPlanSelectedProjects: () => string[],
    getActionPlanSelectedResources: () => string[],
    // getAlreadyAcquiredModifiers: () => LocalPlayerModifiers | Record<string, []>,
    getAlreadyAcquiredModifiers: () => LocalPlayerModifiers | Record<string, { id: string; is_enabled?: boolean; was_bought?: boolean; purchased_requirements?: string[]; remaining_time?:number }[]>,
    getBudget: () => number | undefined,
    updateBudget: (remainingBudget:number) => void,
    updateLocalPlayerBudget: (remainingBudget:number) => void,
    getPotentialRemainingBudget: () => number, //| undefined,
    setPotentialRemainingBudget: (potentialBudget:number) => void,
    updatePotentialRemainingBudget: (potentialBudget:number) => void
}

// export const actionPlanState: ActionPlanStateMethods = {
//     updatePlan: (
//         plan: PlanActions
//     ) => {
//         globalWebSocketService.submitPlan_localPlayerPlan = plan;
//     },
//     updateProductPlan: (
//         products: string[]
//     ) => {
//         globalWebSocketService.submitPlan_localPlayerPlan.products = products;
//     },
//     updateProjectPlan: (
//         projects: string[]
//     ) => {
//         globalWebSocketService.submitPlan_localPlayerPlan.projects = projects;
//     },
//     updateResourcesPlan: (
//         resources: string[]
//     ) => {
//         globalWebSocketService.submitPlan_localPlayerPlan.resources = resources;
//     },
//     resetPlan: () => {
//         globalWebSocketService.submitPlan_localPlayerPlan = { products: [], projects: [], resources: [] };
//     },
//     getActionPlan : () => {
//         return globalWebSocketService.submitPlan_localPlayerPlan;
//     },
//     getActionPlanSelectedProducts: () => {
//         return globalWebSocketService.submitPlan_localPlayerPlan.products;
//     },
//     getActionPlanSelectedProjects: () => {
//         return globalWebSocketService.submitPlan_localPlayerPlan.projects;
//     },
//     getActionPlanSelectedResources: () => {
//         return globalWebSocketService.submitPlan_localPlayerPlan.resources;
//     },
//     getAlreadyAcquiredModifiers: () => {
//         return globalWebSocketService.localPlayerModifiers;
//     },
//     getBudget: () => {
//         return globalWebSocketService.localPlayerDynamicInfo?.budget;
//     },
//     updateBudget: (remainingBudget: number) => {
//         // globalWebSocketService.localPlayerDynamicInfo!.budget = remainingBudget;
//         globalWebSocketService.submitPlan_potentialRemainingBudget = remainingBudget;
//     },
//     updateLocalPlayerBudget: (remainingBudget: number) => {
//         globalWebSocketService.localPlayerDynamicInfo!.budget = remainingBudget;
//     },
//     getPotentialRemainingBudget: () => {
//         return globalWebSocketService.submitPlan_potentialRemainingBudget;
//     },
//     setPotentialRemainingBudget: (potentialBudget: number) => {
//         globalWebSocketService.submitPlan_potentialRemainingBudget = potentialBudget;
//     },
//     updatePotentialRemainingBudget: (potentialBudget: number) => {
//         globalWebSocketService.submitPlan_potentialRemainingBudget = potentialBudget;
//     }
// }