import {
  type RenovationMeasures,
  type SimulationResults,
} from "../types";

// Base energy demand by construction year (kWh/m²·a)
const getBaseEnergyDemand = (yearBuilt: number): number => {
  if (yearBuilt < 1950) return 220;
  if (yearBuilt < 1970) return 200;
  if (yearBuilt < 1980) return 180;
  if (yearBuilt < 1990) return 150;
  if (yearBuilt < 2000) return 120;
  if (yearBuilt < 2010) return 90;
  return 60;
};

// Get efficiency class from energy demand
export const getEfficiencyClass = (demand: number): string => {
  if (demand < 30) return "A+";
  if (demand < 50) return "A";
  if (demand < 75) return "B";
  if (demand < 100) return "C";
  if (demand < 130) return "D";
  if (demand < 160) return "E";
  if (demand < 200) return "F";
  if (demand < 250) return "G";
  return "H";
};

// Calculate initial energy state
export const calculateInitialEnergy = (
  area: number,
  yearBuilt: number,
  heatingSystem: string,
  renovations: {
    roof: boolean;
    facade: boolean;
    windows: boolean;
    basement: boolean;
  }
) => {
  let demand = getBaseEnergyDemand(yearBuilt);

  // Apply renovation reductions
  if (renovations.roof) demand *= 0.85;
  if (renovations.facade) demand *= 0.8;
  if (renovations.windows) demand *= 0.9;
  if (renovations.basement) demand *= 0.95;

  // Energy price (€/kWh)
  const energyPrice =
    heatingSystem === "gas" ? 0.12 : heatingSystem === "oil" ? 0.1 : 0.3;

  // CO2 emissions (kg/kWh)
  const co2Factor =
    heatingSystem === "gas" ? 0.201 : heatingSystem === "oil" ? 0.266 : 0.42;

  const annualCosts = demand * area * energyPrice;
  const co2Emissions = demand * co2Factor;

  return {
    demand: Math.round(demand),
    efficiencyClass: getEfficiencyClass(demand),
    annualCosts: Math.round(annualCosts),
    co2Emissions: Math.round(co2Emissions),
  };
};

// Calculate renovation impact
export const calculateRenovationImpact = (
  currentDemand: number,
  currentCosts: number,
  currentCO2: number,
  area: number,
  measures: RenovationMeasures
): SimulationResults => {
  let newDemand = currentDemand;
  let investment = 0;

  // Building envelope measures
  if (measures.roof) {
    const reduction = measures.roof === "standard77" ? 0.15 : 0.12;
    newDemand *= 1 - reduction;
    investment += measures.roof === "standard77" ? area * 180 : area * 140;
  }

  if (measures.facade) {
    const reduction = measures.facade === "standard77" ? 0.25 : 0.2;
    newDemand *= 1 - reduction;
    investment += measures.facade === "standard77" ? area * 200 : area * 160;
  }

  if (measures.windows) {
    const reduction = measures.windows === "standard77" ? 0.15 : 0.12;
    newDemand *= 1 - reduction;
    investment += measures.windows === "standard77" ? area * 120 : area * 90;
  }

  if (measures.basement) {
    const reduction = measures.basement === "standard77" ? 0.08 : 0.06;
    newDemand *= 1 - reduction;
    investment += measures.basement === "standard77" ? area * 80 : area * 60;
  }

  // Renewable energy
  if (measures.photovoltaic) {
    const pvReduction =
      measures.photovoltaic === "large"
        ? 0.35
        : measures.photovoltaic === "medium"
        ? 0.25
        : 0.15;
    newDemand *= 1 - pvReduction;
    investment +=
      measures.photovoltaic === "large"
        ? 25000
        : measures.photovoltaic === "medium"
        ? 15000
        : 8000;
  }

  if (measures.geothermal) {
    const geoReduction =
      measures.geothermal === "large"
        ? 0.4
        : measures.geothermal === "medium"
        ? 0.3
        : 0.2;
    newDemand *= 1 - geoReduction;
    investment +=
      measures.geothermal === "large"
        ? 35000
        : measures.geothermal === "medium"
        ? 25000
        : 15000;
  }

  if (measures.storage) {
    investment += 8000;
  }

  // Calculate new costs and emissions
  const newCosts = newDemand * area * 0.12;
  const newCO2 = newDemand * 0.201;

  const annualSavings = currentCosts - newCosts;
  const paybackYears = annualSavings > 0 ? investment / annualSavings : 999;
  const co2Reduction = ((currentCO2 - newCO2) / currentCO2) * 100;

  return {
    energyDemand: Math.round(newDemand),
    efficiencyClass: getEfficiencyClass(newDemand),
    annualCosts: Math.round(newCosts),
    co2Emissions: Math.round(newCO2),
    investment: {
      min: Math.round(investment * 0.85),
      max: Math.round(investment * 1.15),
    },
    annualSavings: Math.round(annualSavings),
    paybackYears: Math.round(paybackYears * 10) / 10,
    co2Reduction: Math.round(co2Reduction),
  };
};

// Get city statistics (mock data for Regensburg)
export const getCityStatistics = () => {
  return {
    distribution: [
      { class: "A+", count: 320, percentage: 2 },
      { class: "A", count: 960, percentage: 6 },
      { class: "B", count: 1920, percentage: 12 },
      { class: "C", count: 2560, percentage: 16 },
      { class: "D", count: 3200, percentage: 20 },
      { class: "E", count: 2880, percentage: 18 },
      { class: "F", count: 2240, percentage: 14 },
      { class: "G", count: 1440, percentage: 9 },
      { class: "H", count: 480, percentage: 3 },
    ],
    average: {
      energyDemand: 135,
      efficiencyClass: "D",
    },
  };
};
