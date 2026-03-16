export interface BuildingData {
  id: string;
  address: string;
  geometry: {
    area: number;
    floors: number;
    height: number;
    roofType: string;
  };
  construction: {
    yearBuilt: number;
    renovations: {
      roof?: number;
      facade?: number;
      windows?: number;
      basement?: number;
    };
  };
  heating: {
    system: string;
    energySource: string;
  };
  household: {
    residents: number;
  };
  energyPrices?: {
    electricity: number;
    gas: number;
  };
  currentEnergy: {
    demand: number; // kWh/m²·a
    efficiencyClass: string;
    annualCosts: number;
    co2Emissions: number; // kg/m²·a
  };
}

export enum STEP {
  "welcome" = 0,
  "building" = 1,
  "building-review" = 2,
  "simulation" = 3,
  "results" = 4,
  "decision" = 5,
}

export interface RenovationMeasures {
  roof: 'standard55' | 'standard77' | null;
  facade: 'standard55' | 'standard77' | null;
  windows: 'standard55' | 'standard77' | null;
  basement: 'standard55' | 'standard77' | null;
  photovoltaic: 'small' | 'medium' | 'large' | null;
  geothermal: 'small' | 'medium' | 'large' | null;
  storage: boolean;
}

export interface SimulationResults {
  energyDemand: number; // kWh/m²·a
  efficiencyClass: string;
  annualCosts: number;
  co2Emissions: number; // kg/m²·a
  investment: {
    min: number;
    max: number;
  };
  annualSavings: number;
  paybackYears: number;
  co2Reduction: number; // percentage
}

export interface CityStats {
  distribution: {
    class: string;
    count: number;
    percentage: number;
  }[];
  average: {
    energyDemand: number;
    efficiencyClass: string;
  };
}
