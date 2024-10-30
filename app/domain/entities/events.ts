export interface Event {
    description: string;
    appear_first_in_trimester: number;
    ID: string;
    required_efficiencies: string[];
    result_success: [number, number];
    result_failure: [number, number];
    level: number;
    modifiable_projects: string[];
    modifiable_resources: string[];
    modifiable_products: string[];
  }