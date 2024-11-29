import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse';
import { Efficiency, Project, Resource, Product, Event } from '~/domain/entities';

// const fileFormat = '.csv';
// Obtener __filename y __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataBasePath = path.join(process.cwd(), 'app', 'data');

const dataPaths = {
    projects: path.join(dataBasePath, 'projects.csv'),
    resources: path.join(dataBasePath, 'resources.csv'),
    products: path.join(dataBasePath, 'products.csv'),
    efficiencies: path.join(dataBasePath, 'efficiencies.csv'),
    events: path.join(dataBasePath, 'events.csv'),
    legacy: path.join(dataBasePath, 'legacy.csv'),
}

function loadCSV(filePath: string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      const rows: string[][] = [];
      fs.createReadStream(filePath, { encoding: 'utf-8'})
        .pipe(parse({ 
            delimiter: ';',
            trim: true,
            columns: false, // Si el CSV no tiene cabecera, establece esto en false
            relax_column_count: true, // Permite que las filas tengan un número diferente de columnas 
            encoding:'utf-8'
        }))
        .on('data', (row) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', (error) => reject(error));
    });
  }

// export async function loadData<T>(filePath: string, parseRow: (row: string[]) => T): Promise<T[]> {
//     const rows = await loadCSV(filePath);
//     return rows.map(parseRow);
//   }

  export async function loadProjects(filePath: string): Promise<Record<string, Project>> {
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

  export async function loadResources(filePath: string): Promise<Record<string, Resource>> {
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
  export async function loadProducts(filePath: string): Promise<Record<string, Product>> {
    const productsDict: Record<string, Product> = {};
    const rows = await loadCSV(filePath);
    for (const row of rows) {
        if (row.length < 3) {
            console.warn(`Fila incompleta: ${row}`);
            continue; // Saltar filas inválidas
          }
      const [idx, name, cost, ...requirements] = row;
       // Validar que idx, name y cost no estén vacíos
    if (!idx || !name || !cost) {
        console.warn(`Datos faltantes en la fila: ${row}`);
        continue; // Saltar filas con datos faltantes
      }

      // Convertir el costo a número
    const parsedCost = parseInt(cost, 10);
    if (isNaN(parsedCost)) {
      console.warn(`Costo inválido en la fila: ${row}`);
      continue; // Saltar filas con costo no numérico
    }

    // Filtrar requisitos vacíos y eliminar espacios en blanco
    const filteredRequirements = requirements
      .filter((id) => id && id.trim().length > 0)
      .map((id) => id.trim());

      
      productsDict[idx] = {
        name:name.trim(),
        cost: parsedCost,
        ID: idx.trim(),
        requirements: filteredRequirements,
        purchased_on: null,
      };
    }
    return productsDict;
  }

  export async function loadEfficiencies(filePath: string): Promise<Record<string, Efficiency>> {
    const efficienciesDict: Record<string, Efficiency> = {};
    const rows = await loadCSV(filePath);
    //console.log(rows)
    for (const row of rows) {
        if (!row.length) {
            continue; // Saltar filas vacías
          }
      
      // Encontrar los índices de los separadores '%%%'
    const separatorIndices = row.reduce((indices, value, index) => {
        if (value === '%%%') {
          indices.push(index);
        }
        return indices;
      }, [] as number[]);
  
      // Verificar que hay al menos dos separadores
      if (separatorIndices.length < 2) {
        console.warn(`Fila con formato incorrecto: ${row}`);
        continue;
      }
  
      // Obtener idx y name
      const idx = row[0];
      const name = row[1];
  
      // Obtener modifiersProducts (desde el índice 2 hasta el primer separador)
      const modifiersProducts = row.slice(2, separatorIndices[0]).filter((id) => id.length !== 0);
  
      // Obtener modifiersProjects (entre el primer y el segundo separador)
      const modifiersProjects = row.slice(separatorIndices[0] + 1, separatorIndices[1]).filter((id) => id.length !== 0);
  
      // Obtener modifiersResources (desde el segundo separador hasta el final)
      const modifiersResources = row.slice(separatorIndices[1] + 1).filter((id) => id.length !== 0);
  
      efficienciesDict[idx] = {
        name,
        ID: idx,
        //points: 0,
        modifiable_by_products: modifiersProducts,
        modifiable_by_projects: modifiersProjects,
        modifiable_by_resources: modifiersResources,
      };
    }
    return efficienciesDict;
  }

export async function loadEvents(filePath: string): Promise<Record<string, Event>> {
    const eventsDict: Record<string, Event> = {};
    const efficienciesDict: Record<string, Efficiency> = await loadEfficiencies('app/data/efficiencies.csv');
    const rows = await loadCSV(filePath);
    for (const row of rows) {
        const [idx, trimesterStr, description, ...rest] = row;
        const trimester = parseInt(trimesterStr.slice(-1), 10); // "Q1" -> 1
        const requiredEfficiencies = rest.slice(0, 3);
        const resultSuccess = rest.slice(3, 5).map((x) => parseInt(x, 10)) as [number, number];
        const resultFailure = rest.slice(5, 7).map((x) => parseInt(x, 10)) as [number, number];

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
    const events = await loadEvents(dataPaths.events);
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

export const loadAllModifiersData = async () => {
    const [products, projects, resources] = await Promise.all([
        loadProducts(dataPaths.products),
        loadProjects(dataPaths.projects),
        loadResources(dataPaths.resources)
    ]);
    return { products, projects, resources };
}

export const projectsData = await loadProjects(dataPaths.projects);

class DataLoader {
    projects: Record<string, Project>;
    resources: Record<string, Resource>;
    products: Record<string, Product>;
    efficiencies: Record<string, Efficiency>;
    events: Record<string, Event>;
    legacy: string[][];

    constructor() {
        this.projects = {};
        this.resources = {};
        this.products = {};
        this.efficiencies = {};
        this.events = {};
        this.legacy = [];
    }

    async initialize() {
        this.projects = await loadProjects(dataPaths.projects);
        this.resources = await loadResources(dataPaths.resources);
        this.products = await loadProducts(dataPaths.products);
        this.efficiencies = await loadEfficiencies(dataPaths.efficiencies);
        this.events = await loadEvents(dataPaths.events);
        this.legacy = await loadLegacy(dataPaths.legacy);
        return this;
    }

    async reload() {
        await this.initialize();
    }

    getProjects() {
        return this.projects;
    }

    getResources() {
        return this.resources;
    }

    getProducts() {
        return this.products;
    }

    getEfficiencies() {
        return this.efficiencies;
    }

    getEvents() {
        return this.events;
    }

    getLegacy() {
        return this.legacy;
    }

    getAllData() {
        return {
            projects: this.projects,
            resources: this.resources,
            products: this.products,
            efficiencies: this.efficiencies,
            events: this.events,
            legacy: this.legacy
        };
    }

    getAllModifiersData() {
        return {
            products: this.products,
            projects: this.projects,
            resources: this.resources
        };
    }
}

const dataLoader = new DataLoader();
export const initializedDataLoader = await dataLoader.initialize();