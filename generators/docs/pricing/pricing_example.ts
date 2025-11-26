import * as fs from 'fs';
import * as path from 'path';

// Interfaces för typsäkerhet
interface PricingData {
  company: {
    vat_rate: number;
  };
  hourly_rates: {
    rates: Array<{
      role: string;
      price_per_hour: number;
    }>;
  };
  code_ownership: {
    models: Array<{
      name: string;
      multiplier?: number;
    }>;
  };
  hosting: {
    packages: Array<{
      name: string;
      specs: any;
      costs: {
        flyio_monthly: number;
        siteflow_management_monthly: number;
        total_monthly: number;
      };
    }>;
  };
  packaged_services: {
    services: Array<{
      name: string;
      price_min: number;
      price_max: number;
      duration: string;
      scope: string[];
    }>;
  };
  support: {
    packages: Array<{
      name: string;
      price_monthly: number;
      sla_response_time: string;
      development_hours_monthly?: number;
    }>;
  };
}

// Ladda prislistan
const pricingPath = './siteflow-prislista.json';
const pricing: PricingData = JSON.parse(fs.readFileSync(pricingPath, 'utf-8'));

interface ProjectCostResult {
  role: string;
  hours: number;
  hourly_rate: number;
  base_cost: number;
  ownership_model: string;
  multiplier: number;
  final_cost: number;
  vat: number;
  total_with_vat: number;
}

function calculateProjectCost(hours: number, role: string, ownershipModel: 'license' | 'shared' | 'full' = 'license'): ProjectCostResult {
  // Hitta timpris för roll
  const rate = pricing.hourly_rates.rates.find(r => r.role === role);
  
  if (!rate) {
    throw new Error(`Roll '${role}' hittades inte`);
  }
  
  const hourlyRate = rate.price_per_hour;
  
  // Beräkna baspris
  const baseCost = hours * hourlyRate;
  
  // Hitta ägandemodells multiplier
  let multiplier = 1.0;
  let ownershipName = ownershipModel;
  
  const ownershipMapping: {[key: string]: string} = {
    'license': 'Licensmodell',
    'shared': 'Delad äganderätt',
    'full': 'Full äganderätt'
  };
  
  const targetName = ownershipMapping[ownershipModel] || ownershipModel;
  const model = pricing.code_ownership.models.find(m => m.name === targetName);
  
  if (model && model.multiplier) {
    multiplier = model.multiplier;
    ownershipName = model.name;
  }
  
  const finalCost = baseCost * multiplier;
  
  return {
    role,
    hours,
    hourly_rate: hourlyRate,
    base_cost: baseCost,
    ownership_model: ownershipName,
    multiplier,
    final_cost: finalCost,
    vat: finalCost * pricing.company.vat_rate,
    total_with_vat: finalCost * (1 + pricing.company.vat_rate)
  };
}

function calculateMonthlyHosting(packageName: string) {
  const pkg = pricing.hosting.packages.find(p => p.name === packageName);
  
  if (!pkg) {
    throw new Error(`Hosting-paket '${packageName}' hittades inte`);
  }
  
  return {
    package: pkg.name,
    specs: pkg.specs,
    costs: pkg.costs
  };
}

function findPackagedService(serviceName: string) {
  const service = pricing.packaged_services.services.find(s => s.name === serviceName);
  
  if (!service) {
    throw new Error(`Tjänst '${serviceName}' hittades inte`);
  }
  
  return service;
}

function calculateSupportAnnualCost(supportLevel: string) {
  const pkg = pricing.support.packages.find(p => p.name === supportLevel);
  
  if (!pkg) {
    throw new Error(`Supportnivå '${supportLevel}' hittades inte`);
  }
  
  const monthly = pkg.price_monthly;
  
  return {
    level: pkg.name,
    monthly: monthly,
    annual: monthly * 12,
    sla: pkg.sla_response_time,
    dev_hours_monthly: pkg.development_hours_monthly || 0
  };
}

// ========== EXEMPEL PÅ ANVÄNDNING ==========

console.log("=".repeat(60));
console.log("SITEFLOW PRISBERÄKNINGSEXEMPEL (TypeScript)");
console.log("=".repeat(60));

// Exempel 1: Beräkna projektkostnad
console.log("\n1. PROJEKTKOSTNAD - 300 timmar Elixir-utveckling");
console.log("-".repeat(60));

const ownershipModels: ('license' | 'shared' | 'full')[] = ['license', 'shared', 'full'];

ownershipModels.forEach(ownership => {
  const result = calculateProjectCost(300, 'Elixir-utvecklare', ownership);
  console.log(`\n${result.ownership_model}:`);
  console.log(`  Baspris: ${result.base_cost.toLocaleString()} kr`);
  console.log(`  Multiplier: ${result.multiplier}x`);
  console.log(`  Slutpris: ${result.final_cost.toLocaleString()} kr`);
  console.log(`  Moms (25%): ${result.vat.toLocaleString()} kr`);
  console.log(`  Totalt inkl. moms: ${result.total_with_vat.toLocaleString()} kr`);
});

// Exempel 2: Hosting-kostnader
console.log("\n\n2. HOSTING-KOSTNADER");
console.log("-".repeat(60));

['Starter', 'Growth', 'Scale', 'Enterprise'].forEach(packageName => {
  const hosting = calculateMonthlyHosting(packageName);
  console.log(`\n${packageName}:`);
  console.log(`  Fly.io: ${hosting.costs.flyio_monthly} kr/mån`);
  console.log(`  Siteflow förvaltning: ${hosting.costs.siteflow_management_monthly} kr/mån`);
  console.log(`  Totalt: ${hosting.costs.total_monthly} kr/mån`);
  console.log(`  Årskostnad: ${(hosting.costs.total_monthly * 12).toLocaleString()} kr`);
});

// Exempel 3: Support-kostnader
console.log("\n\n3. SUPPORT-KOSTNADER");
console.log("-".repeat(60));

['Basic Support', 'Standard Support', 'Premium Support'].forEach(level => {
  const support = calculateSupportAnnualCost(level);
  console.log(`\n${support.level}:`);
  console.log(`  Månadskostnad: ${support.monthly.toLocaleString()} kr`);
  console.log(`  Årskostnad: ${support.annual.toLocaleString()} kr`);
  console.log(`  SLA: svar inom ${support.sla}`);
  if (support.dev_hours_monthly > 0) {
    console.log(`  Inkluderade utvecklingstimmar: ${support.dev_hours_monthly}h/mån`);
  }
});

// Exempel 4: Paketerad tjänst
console.log("\n\n4. PAKETERAD TJÄNST - MVP-SYSTEM");
console.log("-".repeat(60));

const mvp = findPackagedService('MVP-system');
console.log(`\nTjänst: ${mvp.name}`);
console.log(`Prisintervall: ${mvp.price_min.toLocaleString()} - ${mvp.price_max.toLocaleString()} kr`);
console.log(`Tidsåtgång: ${mvp.duration}`);
console.log("Omfattning:");
mvp.scope.forEach(item => console.log(`  • ${item}`));

console.log("\nMed olika ägandemodeller (baserat på 300 000 kr):");
const base = 300000;
pricing.code_ownership.models.forEach(model => {
  if (model.multiplier) {
    const final = base * model.multiplier;
    console.log(`  • ${model.name}: ${final.toLocaleString()} kr`);
  }
});

// Exempel 5: Komplett projektberäkning
console.log("\n\n5. KOMPLETT PROJEKTEXEMPEL");
console.log("-".repeat(60));
console.log("\nProjekt: E-handelsplattform med Elixir");
console.log("\nTeam och timmar:");

const projectCosts: ProjectCostResult[] = [];

// Senior arkitekt - 80 timmar
const archCost = calculateProjectCost(80, 'Senior Elixir-arkitekt', 'shared');
projectCosts.push(archCost);
console.log(`  • Senior Elixir-arkitekt: 80h × ${archCost.hourly_rate} kr = ${archCost.base_cost.toLocaleString()} kr`);

// Elixir-utvecklare - 400 timmar
const devCost = calculateProjectCost(400, 'Elixir-utvecklare', 'shared');
projectCosts.push(devCost);
console.log(`  • Elixir-utvecklare: 400h × ${devCost.hourly_rate} kr = ${devCost.base_cost.toLocaleString()} kr`);

// Frontend-utvecklare - 200 timmar
const feCost = calculateProjectCost(200, 'Frontend-utvecklare', 'shared');
projectCosts.push(feCost);
console.log(`  • Frontend-utvecklare: 200h × ${feCost.hourly_rate} kr = ${feCost.base_cost.toLocaleString()} kr`);

// DevOps - 40 timmar
const devopsCost = calculateProjectCost(40, 'DevOps-specialist', 'shared');
projectCosts.push(devopsCost);
console.log(`  • DevOps-specialist: 40h × ${devopsCost.hourly_rate} kr = ${devopsCost.base_cost.toLocaleString()} kr`);

const totalBase = projectCosts.reduce((sum, c) => sum + c.base_cost, 0);
const totalFinal = projectCosts.reduce((sum, c) => sum + c.final_cost, 0);
const totalVat = projectCosts.reduce((sum, c) => sum + c.vat, 0);

console.log(`\nBaspris: ${totalBase.toLocaleString()} kr`);
console.log(`Ägandemodell: Delad äganderätt (1.3x)`);
console.log(`Pris efter ägandemodell: ${totalFinal.toLocaleString()} kr`);
console.log(`Moms (25%): ${totalVat.toLocaleString()} kr`);
console.log(`\n🎯 TOTALT INKL. MOMS: ${(totalFinal + totalVat).toLocaleString()} kr`);

// Lägg till hosting och support
const hosting = calculateMonthlyHosting('Scale');
const support = calculateSupportAnnualCost('Standard Support');

console.log(`\nMånatliga löpande kostnader:`);
console.log(`  • Hosting (Scale): ${hosting.costs.total_monthly.toLocaleString()} kr/mån`);
console.log(`  • Support (Standard): ${support.monthly.toLocaleString()} kr/mån`);
console.log(`  • Totalt löpande: ${(hosting.costs.total_monthly + support.monthly).toLocaleString()} kr/mån`);
console.log(`  • Årskostnad löpande: ${((hosting.costs.total_monthly + support.monthly) * 12).toLocaleString()} kr`);

console.log("\n" + "=".repeat(60));
console.log("Alla priser är i SEK och exklusive moms där inget annat anges");
console.log("=".repeat(60));
