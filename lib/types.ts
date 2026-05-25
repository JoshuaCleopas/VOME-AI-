export type Currency = "GHS";

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currency: Currency;
  deadline: string;
  createdAt: string;
};

export type FundingSourceStatus = "confirmed" | "pending" | "deployed";

export type FundingSource = {
  id: string;
  name: string;
  targetAmount: number;
  status: FundingSourceStatus;
  color: string;
  icon: string;
  order: number;
};

export type MoneyLog = {
  id: string;
  amount: number;
  sourceId: string;
  date: string;
  notes?: string;
  createdAt: string;
};

export type VehicleDirection = "buying" | "selling";

export type VehicleStatus =
  | "to-source"
  | "listed"
  | "inspecting"
  | "negotiating"
  | "purchased"
  | "sold";

export type StatusHistoryEntry = {
  status: VehicleStatus;
  date: string;
  note?: string;
};

export type Vehicle = {
  id: string;
  name: string;
  direction: VehicleDirection;
  workingPrice: number;
  priceRangeLow: number;
  priceRangeHigh: number;
  status: VehicleStatus;
  trim: string;
  role: string;
  notes?: string;
  imageUrl?: string;
  statusHistory: StatusHistoryEntry[];
};

export type ActionPhase =
  | "Week 1"
  | "Weeks 2-4"
  | "Weeks 4-8"
  | "Post-Purchase";

export type ActionCategory =
  | "Sales"
  | "Loan"
  | "Buy-side"
  | "Tax"
  | "Insurance"
  | "Operations";

export type ActionPriority = "High" | "Medium" | "Low";
export type ActionStatus = "Not Started" | "In Progress" | "Done";

export type ActionItem = {
  id: string;
  task: string;
  phase: ActionPhase;
  category: ActionCategory;
  priority: ActionPriority;
  status: ActionStatus;
  notes?: string;
  completedAt?: string;
  order: number;
};

export type LoanScenario = {
  id: string;
  label: string;
  principal: number;
  apr: number;
  termMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
};

export type AppState = {
  goal: Goal;
  sources: FundingSource[];
  logs: MoneyLog[];
  vehicles: Vehicle[];
  tasks: ActionItem[];
  scenarios: LoanScenario[];
  lastUsedSourceId?: string;
};
