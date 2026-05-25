import { nanoid } from "nanoid";
import { computeLoan } from "./loan";
import type {
  ActionItem,
  AppState,
  FundingSource,
  Goal,
  LoanScenario,
  Vehicle,
} from "./types";

function id(): string {
  return nanoid(10);
}

export function buildSeedState(): AppState {
  const createdAt = new Date().toISOString();
  const today = new Date();
  const deadline = new Date(today);
  deadline.setDate(deadline.getDate() + 70);

  const goal: Goal = {
    id: id(),
    name: "Two Vehicles for VOME Studio",
    targetAmount: 828_000,
    currency: "GHS",
    deadline: deadline.toISOString().slice(0, 10),
    createdAt,
  };

  const sources: FundingSource[] = [
    {
      id: id(),
      name: "Bank Loan",
      targetAmount: 250_000,
      status: "confirmed",
      color: "#104241",
      icon: "🏦",
      order: 0,
    },
    {
      id: id(),
      name: "Civic Sale",
      targetAmount: 180_000,
      status: "pending",
      color: "#285453",
      icon: "🚙",
      order: 1,
    },
    {
      id: id(),
      name: "Sonata Sale",
      targetAmount: 155_000,
      status: "pending",
      color: "#3a6e6d",
      icon: "🚗",
      order: 2,
    },
    {
      id: id(),
      name: "Cash Injection",
      targetAmount: 243_000,
      status: "pending",
      color: "#FFD7B4",
      icon: "💼",
      order: 3,
    },
  ];

  const vehicles: Vehicle[] = [
    {
      id: id(),
      name: "Jetour T2",
      direction: "buying",
      workingPrice: 450_000,
      priceRangeLow: 430_000,
      priceRangeHigh: 480_000,
      status: "to-source",
      trim: "Travel+ AWD, brand new",
      role: "Daily driver, project sites, team utility",
      statusHistory: [{ status: "to-source", date: createdAt }],
    },
    {
      id: id(),
      name: "Toyota Camry 2018",
      direction: "buying",
      workingPrice: 300_000,
      priceRangeLow: 280_000,
      priceRangeHigh: 330_000,
      status: "to-source",
      trim: "XSE, foreign used",
      role: "Client meetings, partner pitches",
      statusHistory: [{ status: "to-source", date: createdAt }],
    },
    {
      id: id(),
      name: "Honda Civic Touring",
      direction: "selling",
      workingPrice: 180_000,
      priceRangeLow: 160_000,
      priceRangeHigh: 195_000,
      status: "to-source",
      trim: "2016 Touring",
      role: "Currently personal — to sell",
      statusHistory: [{ status: "to-source", date: createdAt }],
    },
    {
      id: id(),
      name: "Hyundai Sonata",
      direction: "selling",
      workingPrice: 155_000,
      priceRangeLow: 140_000,
      priceRangeHigh: 170_000,
      status: "to-source",
      trim: "2017",
      role: "Currently personal — to sell",
      statusHistory: [{ status: "to-source", date: createdAt }],
    },
  ];

  const taskSeed: Omit<ActionItem, "id" | "order">[] = [
    // Week 1
    { task: "Take quality photos of Civic + Sonata", phase: "Week 1", category: "Sales", priority: "High", status: "Not Started" },
    { task: "List both vehicles on Jiji + Tonaton + Cars45", phase: "Week 1", category: "Sales", priority: "High", status: "Not Started" },
    { task: "Pull Cars45 instant quotes as floor reference", phase: "Week 1", category: "Sales", priority: "Medium", status: "Not Started" },
    { task: "Get bank loan terms in writing — APR, term, fees", phase: "Week 1", category: "Loan", priority: "High", status: "Not Started" },
    { task: "Identify 3 Jetour T2 dealers with Travel+ AWD", phase: "Week 1", category: "Buy-side", priority: "Medium", status: "Not Started" },
    { task: "Begin scanning for clean 2018 Camry XSE", phase: "Week 1", category: "Buy-side", priority: "Medium", status: "Not Started" },
    { task: "Brief accountant on director's loan structure", phase: "Week 1", category: "Tax", priority: "High", status: "Not Started" },
    { task: "Confirm capital allowance class for both vehicles", phase: "Week 1", category: "Tax", priority: "Medium", status: "Not Started" },
    // Weeks 2-4
    { task: "Field serious offers on Civic and Sonata", phase: "Weeks 2-4", category: "Sales", priority: "High", status: "Not Started" },
    { task: "Close at least one vehicle sale", phase: "Weeks 2-4", category: "Sales", priority: "High", status: "Not Started" },
    { task: "Pre-purchase inspection on Camry candidate", phase: "Weeks 2-4", category: "Buy-side", priority: "High", status: "Not Started" },
    { task: "Get insurance quotes from 2 insurers", phase: "Weeks 2-4", category: "Insurance", priority: "Medium", status: "Not Started" },
    { task: "Confirm Jetour dealer pricing + trade-in offers", phase: "Weeks 2-4", category: "Buy-side", priority: "Medium", status: "Not Started" },
    { task: "Execute director's loan agreement with VOME", phase: "Weeks 2-4", category: "Tax", priority: "High", status: "Not Started" },
    // Weeks 4-8
    { task: "Close second vehicle sale", phase: "Weeks 4-8", category: "Sales", priority: "High", status: "Not Started" },
    { task: "Inject sale proceeds into VOME via director's loan", phase: "Weeks 4-8", category: "Tax", priority: "High", status: "Not Started" },
    { task: "Sign Camry purchase + register to VOME Studio", phase: "Weeks 4-8", category: "Buy-side", priority: "High", status: "Not Started" },
    { task: "Sign bank loan agreement (after fee review)", phase: "Weeks 4-8", category: "Loan", priority: "High", status: "Not Started" },
    { task: "Close Jetour purchase + register to VOME Studio", phase: "Weeks 4-8", category: "Buy-side", priority: "High", status: "Not Started" },
    { task: "Activate comprehensive insurance before driving off", phase: "Weeks 4-8", category: "Insurance", priority: "High", status: "Not Started" },
    { task: "Install tracking devices on both vehicles", phase: "Weeks 4-8", category: "Operations", priority: "Medium", status: "Not Started" },
    // Post-Purchase
    { task: "Automate monthly bank loan payment", phase: "Post-Purchase", category: "Loan", priority: "High", status: "Not Started" },
    { task: "Set up vehicle expense category in VOME bookkeeping", phase: "Post-Purchase", category: "Operations", priority: "Medium", status: "Not Started" },
    { task: "Create driver/usage log template per vehicle", phase: "Post-Purchase", category: "Tax", priority: "Medium", status: "Not Started" },
    { task: "Centralize docs (insurance, registration, warranty, sales, loan)", phase: "Post-Purchase", category: "Operations", priority: "Medium", status: "Not Started" },
    { task: "Schedule quarterly review: VOME cash flow vs director's loan repayment", phase: "Post-Purchase", category: "Operations", priority: "Low", status: "Not Started" },
  ];

  const tasks: ActionItem[] = taskSeed.map((t, idx) => ({
    ...t,
    id: id(),
    order: idx,
  }));

  const scenarioSeed: { label: string; principal: number; apr: number; termMonths: number }[] = [
    { label: "36 months", principal: 250_000, apr: 17, termMonths: 36 },
    { label: "48 months (recommended)", principal: 250_000, apr: 17, termMonths: 48 },
    { label: "60 months", principal: 250_000, apr: 17, termMonths: 60 },
  ];

  const scenarios: LoanScenario[] = scenarioSeed.map((s) => {
    const c = computeLoan(s.principal, s.apr, s.termMonths);
    return { id: id(), ...s, ...c };
  });

  return {
    goal,
    sources,
    logs: [],
    vehicles,
    tasks,
    scenarios,
  };
}
