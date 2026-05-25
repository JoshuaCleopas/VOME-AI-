export type LoanComputation = {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
};

export function computeLoan(
  principal: number,
  aprPercent: number,
  termMonths: number,
): LoanComputation {
  const r = aprPercent / 100 / 12;
  const n = termMonths;
  let monthly: number;
  if (r === 0) {
    monthly = principal / n;
  } else {
    monthly = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }
  const totalCost = monthly * n;
  const totalInterest = totalCost - principal;
  return {
    monthlyPayment: Math.round(monthly),
    totalInterest: Math.round(totalInterest),
    totalCost: Math.round(totalCost),
  };
}

export type AmortRow = {
  month: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
};

export function amortizationSchedule(
  principal: number,
  aprPercent: number,
  termMonths: number,
): AmortRow[] {
  const { monthlyPayment } = computeLoan(principal, aprPercent, termMonths);
  const r = aprPercent / 100 / 12;
  let balance = principal;
  let cumP = 0;
  let cumI = 0;
  const rows: AmortRow[] = [];
  for (let m = 1; m <= termMonths; m++) {
    const interest = balance * r;
    const principalPaid = Math.max(0, monthlyPayment - interest);
    balance = Math.max(0, balance - principalPaid);
    cumP += principalPaid;
    cumI += interest;
    rows.push({
      month: m,
      principalPaid,
      interestPaid: interest,
      balance,
      cumulativePrincipal: cumP,
      cumulativeInterest: cumI,
    });
  }
  return rows;
}
