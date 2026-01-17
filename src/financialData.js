// financialData.js - Update this file monthly with your latest numbers

export const financialData = {
  // === CURRENT BALANCES (Update Monthly) ===
  currentBalances: {
    rothIRA: 15429.31,
    chaseChecking: 2368.22,
    tdSavings: 3000.17,
    studentLoans: 22250,
    autoLoan: 20850,
  },

  // === MONTHLY INCOME ===
  income: {
    biWeeklyNet: 1506.39,
    grossAnnual: 52000,
  },

  // === ROTH IRA HISTORY ===
  rothIRAHistory: [
    { month: 'Dec 24', value: 2979.27, contributions: 3000, gain: -20.73 },
    { month: 'Jan 25', value: 7675.69, contributions: 7600, gain: 75.69 },
    { month: 'Mar 25', value: 8623.67, contributions: 9400, gain: -776.33 },
    { month: 'Apr 25', value: 8637.30, contributions: 9400, gain: -762.70 },
    { month: 'May 25', value: 9956.79, contributions: 9975, gain: -18.21 },
    { month: 'Jun 25', value: 10617.89, contributions: 9975, gain: 642.89 },
    { month: 'Jul 25', value: 10954.81, contributions: 9975, gain: 979.81 },
    { month: 'Sep 25', value: 13452.52, contributions: 11789.66, gain: 1662.86 },
    { month: 'Oct 25', value: 17351.50, contributions: 13289.66, gain: 4061.84 },
    { month: 'Nov 25', value: 16637.11, contributions: 13289.66, gain: 3347.45 },
    { month: 'Dec 25', value: 15429.31, contributions: 13289.66, gain: 2139.65 },
  ],

  // === CHECKING ACCOUNT HISTORY ===
  checkingHistory: [
    { month: 'Mar 25', balance: 552.00 },
    { month: 'Apr 25', balance: 6499.19 },
    { month: 'May 25', balance: 5339.24 },
    { month: 'Jun 25', balance: 5339.24 },
    { month: 'Jul 25', balance: 2735.58 },
    { month: 'Aug 25', balance: 1503.72 },
    { month: 'Sep 25', balance: 3855.04 },
    { month: 'Oct 25', balance: 3442.32 },
    { month: 'Nov 25', balance: 3123.07 },
    { month: 'Dec 25', balance: 2368.22 },
  ],

  // === SAVINGS ACCOUNT HISTORY ===
  savingsHistory: [
    { month: 'Jan 25', balance: 2256.42 },
    { month: 'Feb 25', balance: 2334.46 },
    { month: 'Mar 25', balance: 534.47 },
    { month: 'May 25', balance: 1159.49 },
    { month: 'Jun 25', balance: 4859.54 },
    { month: 'Jul 25', balance: 4259.60 },
    { month: 'Aug 25', balance: 3014.66 },
    { month: 'Sep 25', balance: 2400.06 },
    { month: 'Oct 25', balance: 1500.09 },
    { month: 'Nov 25', balance: 2100.12 },
    { month: 'Dec 25', balance: 3000.17 },
  ],

  // === MONTHLY SPENDING HISTORY ===
  spendingHistory: [
    { month: 'Jan 25', spending: 1835.50 },
    { month: 'Feb 25', spending: 1158.77 },
    { month: 'Mar 25', spending: 6490.88 }, // Moving + Skydiving
    { month: 'Apr 25', spending: 3802.94 },
    { month: 'May 25', spending: 2646.10 },
    { month: 'Jun 25', spending: 2141.42 },
    { month: 'Jul 25', spending: 2379.52 },
    { month: 'Aug 25', spending: 1536.55 },
    { month: 'Sep 25', spending: 2433.49 },
    { month: 'Oct 25', spending: 2048.52 },
    { month: 'Nov 25', spending: 2449.16 },
    { month: 'Dec 25', spending: 1925.59 },
  ],

  // === ROTH IRA HOLDINGS (Current Allocation) ===
  rothHoldings: [
    { name: 'Mutual Funds', value: 9165, percent: 60 },
    { name: 'Stocks', value: 5736, percent: 37 },
    { name: 'ETFs', value: 499, percent: 3 },
  ],

  // === WEALTH GOAL ===
  wealthGoal: {
    target: 180000,
    targetDate: 'August 2030',
  },
};

// === DEFAULT SCENARIO SETTINGS ===
export const defaultScenario = {
  monthlyRothContribution: 583, // $7,000/year
  monthlySavings: 600,
  autoLoanPayment: 457,
  autoLoanExtra: 0,
  studentLoanPayment: 400,
  studentLoanExtra: 0,
  expectedAnnualReturn: 8, // %
  salaryIncrease: 0, // Additional monthly income
};
