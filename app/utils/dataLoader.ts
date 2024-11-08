import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { Efficiency, Project, Resource, Product, Event } from '~/domain/entities';

const fileFormat = '.csv';

const dataPaths = {
    projects: path.join(__dirname, '../data/projects', fileFormat),
    resources: path.join(__dirname, '../data/resources', fileFormat),
    products: path.join(__dirname, '../data/products', fileFormat),
    efficiencies: path.join(__dirname, '../data/efficiencies', fileFormat),
    events: path.join(__dirname, '../data/events', fileFormat),
    legacy: path.join(__dirname, '../data/legacy', fileFormat),
}

function loadCSV(filePath: string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      const rows: string[][] = [];
      fs.createReadStream(filePath)
        .pipe(parse({ delimiter: ';' }))
        .on('data', (row) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', (error) => reject(error));
    });
  }

// export async function loadData<T>(filePath: string, parseRow: (row: string[]) => T): Promise<T[]> {
//     const rows = await loadCSV(filePath);
//     return rows.map(parseRow);
//   }

  async function loadProjects(filePath: string): Promise<Record<string, Project>> {
    const projectsDict: Record<string, Project> = {};
    const rows = await loadCSV(filePath);
    for (const row of rows) {
      const [idx, name, cost, ...deliveredProducts] = row;
      projectsDict[idx] = {
        name,
        cost: parseInt(cost, 10),
        ID: idx,
        delivered_products: deliveredProducts.filter((id) => id.length !== 0),
        start_datum: 0,
        purchased_on: null,
      };
    }
    return projectsDict;
  }

  async function loadResources(filePath: string): Promise<Record<string, Resource>> {
    const resourcesDict: Record<string, Resource> = {};
    const rows = await loadCSV(filePath);
    for (const row of rows) {
      const [idx, name, cost, monthlySalary, ...developedProducts] = row;
      resourcesDict[idx] = {
        name,
        cost: parseInt(cost, 10),
        ID: idx,
        developed_products: developedProducts.filter((id) => id.length !== 0),
        monthly_salary: parseInt(monthlySalary, 10),
        purchased_on: null,
      };
    }
    return resourcesDict;
  }
  async function loadProducts(filePath: string): Promise<Record<string, Product>> {
    const productsDict: Record<string, Product> = {};
    const rows = await loadCSV(filePath);
    for (const row of rows) {
      const [idx, name, cost, ...requirements] = row;
      productsDict[idx] = {
        name,
        cost: parseInt(cost, 10),
        ID: idx,
        requirements: requirements.filter((id) => id.length !== 0),
        purchased_on: null,
      };
    }
    return productsDict;
  }

  async function loadEfficiencies(filePath: string): Promise<Record<string, Efficiency>> {
    const efficienciesDict: Record<string, Efficiency> = {};
    const rows = await loadCSV(filePath);
    console.log(rows)
    for (const row of rows) {
      const [idx, name, ...modifiers] = row[0].split('%%%');
      const modifiersProducts = modifiers[0].split(';').filter((id) => id.length !== 0);
      const modifiersProjects = modifiers[1].split(';').filter((id) => id.length !== 0);
      const modifiersResources = modifiers[2].split(';').filter((id) => id.length !== 0);
  
      efficienciesDict[idx] = {
        name,
        ID: idx,
        points: 0,
        modifiable_by_products: modifiersProducts,
        modifiable_by_projects: modifiersProjects,
        modifiable_by_resources: modifiersResources,
      };
    }
    return efficienciesDict;
  }

async function loadEvents(filePath: string, efficienciesDict: Record<string, Efficiency>): Promise<Record<string, Event>> {
    const eventsDict: Record<string, Event> = {};
    const rows = await loadCSV(filePath);
    for (const row of rows) {
        const [idx, trimesterStr, description, ...rest] = row;
        const trimester = parseInt(trimesterStr.slice(-1), 10); // "Q1" -> 1
        const requiredEfficiencies = rest.slice(0, 3);
        const resultSuccess = rest.slice(3, 5).map((x) => parseInt(x, 10)) as [number, number];
        const resultFailure = rest.slice(5, 7).map((x) => -parseInt(x, 10)) as [number, number];

        const modifiableProducts = requiredEfficiencies.flatMap(efficiencyId => efficienciesDict[efficiencyId]?.modifiable_by_products || []);
        const modifiableProjects = requiredEfficiencies.flatMap(efficiencyId => efficienciesDict[efficiencyId]?.modifiable_by_projects || []);
        const modifiableResources = requiredEfficiencies.flatMap(efficiencyId => efficienciesDict[efficiencyId]?.modifiable_by_resources || []);

        eventsDict[idx] = {
            description,
            appear_first_in_trimester: trimester,
            ID: idx,
            required_efficiencies: requiredEfficiencies,
            result_success: resultSuccess,
            result_failure: resultFailure,
            level: 0,
            modifiable_products: modifiableProducts,
            modifiable_projects: modifiableProjects,
            modifiable_resources: modifiableResources,
        };
    }
    return eventsDict;
}
  

  async function loadLegacy(filePath: string): Promise<string[][]> {
    const rows = await loadCSV(filePath);
    return rows;
  }

const dirnameWithoutUtils = __dirname.split('utils')[0];

export async function loadAllData(): Promise<{ projects: Record<string, Project>, resources: Record<string, Resource>, products: Record<string, Product>, efficiencies: Record<string, Efficiency>, events:Record<string, Event>, legacy: string[][] }> {
    const efficiencies = await loadEfficiencies(path.join(dirnameWithoutUtils, 'data', 'efficiencies.csv'));
    const products = await loadProducts(dataPaths.products);
    const projects = await loadProjects(dataPaths.projects);
    const resources = await loadResources(dataPaths.resources);
    const events = await loadEvents(dataPaths.events, efficiencies);
    const legacy = await loadLegacy(dataPaths.legacy);

    console.log(projects, resources, products, efficiencies, events, legacy)
    return { 
        projects, 
        resources, 
        products, 
        efficiencies, 
        events, 
        legacy 
    };
  }

