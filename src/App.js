import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { financialData, defaultScenario } from './financialData';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [scenario, setScenario] = useState(defaultScenario);
  const [showScenarioPlanner, setShowScenarioPlanner] = useState(false);

  // Calculate derived values
  const totalAssets = financialData.currentBalances.rothIRA + 
                      financialData.currentBalances.chaseChecking + 
                      financialData.currentBalances.tdSavings;
  
  const totalDebts = financialData.currentBalances.studentLoans + 
                     financialData.currentBalances.autoLoan;
  
  const netWorth = totalAssets - totalDebts;
  const monthlyNet = financialData.income.biWeeklyNet * 26 / 12;

  // Scenario Planning Calculations
  const calculateDebtFreeDate = () => {
    let autoLoanRemaining = financialData.currentBalances.autoLoan;
    let studentLoanRemaining = financialData.currentBalances.studentLoans;
    let monthsToAutoPayoff = 0;
    let monthsToStudentPayoff = 0;

    const autoLoanRate = 0.0544 / 12;
    const studentLoanRate = 0.045 / 12;

    // Auto loan payoff
    const totalAutoPayment = scenario.autoLoanPayment + scenario.autoLoanExtra;
    while (autoLoanRemaining > 0 && monthsToAutoPayoff < 600) {
      const interest = autoLoanRemaining * autoLoanRate;
      const principal = totalAutoPayment - interest;
      autoLoanRemaining -= principal;
      monthsToAutoPayoff++;
    }

    // Student loan payoff (after auto loan is paid)
    const totalStudentPayment = scenario.studentLoanPayment + scenario.studentLoanExtra + 
                                (monthsToAutoPayoff > 0 ? scenario.autoLoanPayment + scenario.autoLoanExtra : 0);
    while (studentLoanRemaining > 0 && monthsToStudentPayoff < 600) {
      const interest = studentLoanRemaining * studentLoanRate;
      const principal = totalStudentPayment - interest;
      studentLoanRemaining -= principal;
      monthsToStudentPayoff++;
    }

    const totalMonths = monthsToAutoPayoff + monthsToStudentPayoff;
    const debtFreeDate = new Date();
    debtFreeDate.setMonth(debtFreeDate.getMonth() + totalMonths);

    return {
      autoPayoffMonths: monthsToAutoPayoff,
      studentPayoffMonths: monthsToStudentPayoff,
      totalMonths: totalMonths,
      debtFreeDate: debtFreeDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      autoPayoffDate: new Date(Date.now() + monthsToAutoPayoff * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
  };

  const calculateNetWorthProjection = () => {
    const projection = [];
    const monthlyReturn = scenario.expectedAnnualReturn / 100 / 12;
    let currentNetWorth = netWorth;
    let rothValue = financialData.currentBalances.rothIRA;
    let savingsValue = financialData.currentBalances.tdSavings;
    let autoLoan = financialData.currentBalances.autoLoan;
    let studentLoan = financialData.currentBalances.studentLoans;

    for (let month = 0; month <= 56; month++) {
      // Investment growth
      rothValue = rothValue * (1 + monthlyReturn) + scenario.monthlyRothContribution;
      savingsValue += scenario.monthlySavings;

      // Debt paydown
      if (autoLoan > 0) {
        const autoPayment = Math.min(scenario.autoLoanPayment + scenario.autoLoanExtra, autoLoan);
        autoLoan = Math.max(0, autoLoan - autoPayment);
      } else {
        // Once auto loan is paid, redirect to student loans
        const studentPayment = Math.min(
          scenario.studentLoanPayment + scenario.studentLoanExtra + scenario.autoLoanPayment + scenario.autoLoanExtra,
          studentLoan
        );
        studentLoan = Math.max(0, studentLoan - studentPayment);
      }

      currentNetWorth = rothValue + savingsValue - autoLoan - studentLoan;

      if (month % 6 === 0) {
        const date = new Date();
        date.setMonth(date.getMonth() + month);
        projection.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          netWorth: Math.round(currentNetWorth),
          assets: Math.round(rothValue + savingsValue),
          debts: Math.round(autoLoan + studentLoan)
        });
      }
    }

    return projection;
  };

  const debtProjection = calculateDebtFreeDate();
  const netWorthProjection = calculateNetWorthProjection();

  // Format currency
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatCurrencyFull = (value) => {
    if (value === undefined || value === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Calculate summary stats
  const avgMonthlySpending = financialData.spendingHistory.reduce((a, b) => a + b.spending, 0) / financialData.spendingHistory.length;
  const rothGrowth = ((financialData.currentBalances.rothIRA - 2979.27) / 2979.27 * 100).toFixed(1);

  // Net worth history
  const netWorthData = [
    { month: 'Jan 25', netWorth: -42213 },
    { month: 'Mar 25', netWorth: -36590 },
    { month: 'May 25', netWorth: -29145 },
    { month: 'Jul 25', netWorth: -26949 },
    { month: 'Sep 25', netWorth: -24492 },
    { month: 'Nov 25', netWorth: -21640 },
    { month: 'Dec 25', netWorth: -22303 },
  ];

  const StatCard = ({ title, value, subtitle, color = 'blue' }) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-emerald-500 to-emerald-600',
      red: 'from-red-500 to-red-600',
      purple: 'from-purple-500 to-purple-600',
      amber: 'from-amber-500 to-amber-600',
    };

    return (
      <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 text-white shadow-xl`}>
        <p className="text-sm opacity-90 mb-1">{title}</p>
        <p className="text-3xl font-bold mb-1">{value}</p>
        {subtitle && <p className="text-xs opacity-75">{subtitle}</p>}
      </div>
    );
  };

  const ScenarioControl = ({ label, value, onChange, min, max, step, prefix = '', suffix = '' }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <span className="text-emerald-400 font-semibold">
          {prefix}{value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Financial Command Center
          </h1>
          <p className="text-slate-400">Path to $180k by August 2030 • 40-Year Time Horizon</p>
        </div>

        {/* Scenario Planner Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowScenarioPlanner(!showScenarioPlanner)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
          >
            {showScenarioPlanner ? '📊 Hide' : '🎯 Show'} Scenario Planner
          </button>
        </div>

        {/* Scenario Planner Panel */}
        {showScenarioPlanner && (
          <div className="mb-8 bg-slate-900/50 rounded-2xl p-6 border border-purple-500/30">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>🎯</span> What-If Scenario Planner
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-400">💰 Monthly Contributions</h3>
                <ScenarioControl
                  label="Roth IRA Contribution"
                  value={scenario.monthlyRothContribution}
                  onChange={(v) => setScenario({...scenario, monthlyRothContribution: v})}
                  min={0}
                  max={1000}
                  step={25}
                  prefix="$"
                />
                <ScenarioControl
                  label="Savings Account"
                  value={scenario.monthlySavings}
                  onChange={(v) => setScenario({...scenario, monthlySavings: v})}
                  min={0}
                  max={2000}
                  step={50}
                  prefix="$"
                />
                <ScenarioControl
                  label="Salary Increase (Monthly)"
                  value={scenario.salaryIncrease}
                  onChange={(v) => setScenario({...scenario, salaryIncrease: v})}
                  min={0}
                  max={3000}
                  step={100}
                  prefix="$"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-400">💳 Debt Payments</h3>
                <ScenarioControl
                  label="Auto Loan Payment"
                  value={scenario.autoLoanPayment}
                  onChange={(v) => setScenario({...scenario, autoLoanPayment: v})}
                  min={457}
                  max={457}
                  step={1}
                  prefix="$"
                />
                <ScenarioControl
                  label="Auto Loan EXTRA Payment"
                  value={scenario.autoLoanExtra}
                  onChange={(v) => setScenario({...scenario, autoLoanExtra: v})}
                  min={0}
                  max={2000}
                  step={50}
                  prefix="$"
                />
                <ScenarioControl
                  label="Student Loan Payment"
                  value={scenario.studentLoanPayment}
                  onChange={(v) => setScenario({...scenario, studentLoanPayment: v})}
                  min={400}
                  max={400}
                  step={1}
                  prefix="$"
                />
                <ScenarioControl
                  label="Student Loan EXTRA Payment"
                  value={scenario.studentLoanExtra}
                  onChange={(v) => setScenario({...scenario, studentLoanExtra: v})}
                  min={0}
                  max={2000}
                  step={50}
                  prefix="$"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">📈 Investment Assumptions</h3>
              <ScenarioControl
                label="Expected Annual Return"
                value={scenario.expectedAnnualReturn}
                onChange={(v) => setScenario({...scenario, expectedAnnualReturn: v})}
                min={3}
                max={12}
                step={0.5}
                suffix="%"
              />
            </div>

            {/* Scenario Results */}
            <div className="mt-8 p-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/50">
              <h3 className="text-xl font-bold mb-4">📊 Projected Outcomes</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Auto Loan Payoff</p>
                  <p className="text-2xl font-bold text-emerald-400">{debtProjection.autoPayoffDate}</p>
                  <p className="text-xs text-slate-500">{debtProjection.autoPayoffMonths} months</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Debt-Free Date</p>
                  <p className="text-2xl font-bold text-blue-400">{debtProjection.debtFreeDate}</p>
                  <p className="text-xs text-slate-500">{debtProjection.totalMonths} months total</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Aug 2030 Net Worth</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {formatCurrency(netWorthProjection[netWorthProjection.length - 1]?.netWorth || 0)}
                  </p>
                  <p className="text-xs text-slate-500">Projected</p>
                </div>
              </div>

              {/* Projection Chart */}
              <div className="mt-6">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={netWorthProjection}>
                    <defs>
                      <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} tickFormatter={formatCurrency} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      formatter={(value) => [formatCurrency(value), '']}
                    />
                    <Area type="monotone" dataKey="netWorth" stroke="#10b981" fill="url(#netWorthGradient)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <button
              onClick={() => setScenario(defaultScenario)}
              className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              Reset to Default
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['overview', 'investments', 'debt', 'goals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Net Worth"
                value={formatCurrency(netWorth)}
                subtitle="Current position"
                color="purple"
              />
              <StatCard
                title="Total Assets"
                value={formatCurrency(totalAssets)}
                subtitle="Liquid + Investments"
                color="green"
              />
              <StatCard
                title="Total Debt"
                value={formatCurrency(totalDebts)}
                subtitle="Auto + Student"
                color="red"
              />
              <StatCard
                title="Monthly Net"
                value={formatCurrency(monthlyNet)}
                subtitle="After-tax income"
                color="blue"
              />
            </div>

            {/* Net Worth Trend */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-semibold mb-4">📈 Net Worth Trajectory</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={netWorthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={formatCurrency} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    formatter={(value) => [formatCurrency(value), 'Net Worth']}
                  />
                  <Line type="monotone" dataKey="netWorth" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Asset Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-lg font-semibold mb-4">💰 Asset Allocation</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Roth IRA', value: financialData.currentBalances.rothIRA, color: '#10b981' },
                        { name: 'Savings', value: financialData.currentBalances.tdSavings, color: '#3b82f6' },
                        { name: 'Checking', value: financialData.currentBalances.chaseChecking, color: '#8b5cf6' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: 'Roth IRA', value: financialData.currentBalances.rothIRA, color: '#10b981' },
                        { name: 'Savings', value: financialData.currentBalances.tdSavings, color: '#3b82f6' },
                        { name: 'Checking', value: financialData.currentBalances.chaseChecking, color: '#8b5cf6' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Roth IRA</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(financialData.currentBalances.rothIRA)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">TD Savings</span>
                    <span className="font-semibold text-blue-400">{formatCurrency(financialData.currentBalances.tdSavings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Chase Checking</span>
                    <span className="font-semibold text-purple-400">{formatCurrency(financialData.currentBalances.chaseChecking)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-lg font-semibold mb-4">📊 Monthly Spending Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={financialData.spendingHistory.slice(-6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#94a3b8" tickFormatter={formatCurrency} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      formatter={(value) => [formatCurrency(value), 'Spending']}
                    />
                    <Bar dataKey="spending" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-slate-400">6-Month Average</span>
                  <span className="text-lg font-semibold text-amber-400">{formatCurrency(avgMonthlySpending)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Investments Tab */}
        {activeTab === 'investments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Roth IRA"
                value={formatCurrencyFull(financialData.currentBalances.rothIRA)}
                subtitle="Current value"
                color="green"
              />
              <StatCard
                title="Total Contributed"
                value={formatCurrency(13290)}
                subtitle="Since Dec 2024"
                color="blue"
              />
              <StatCard
                title="Total Gains"
                value={formatCurrencyFull(financialData.currentBalances.rothIRA - 13290)}
                subtitle={`${rothGrowth}% return`}
                color="purple"
              />
              <StatCard
                title="2025 Progress"
                value={formatCurrency(10290)}
                subtitle="$7k annual limit"
                color="amber"
              />
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-semibold mb-4">📈 Roth IRA Growth</h2>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={financialData.rothIRAHistory}>
                  <defs>
                    <linearGradient id="rothGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="contributionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={formatCurrency} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    formatter={(value) => [formatCurrency(value), '']}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="contributions" stroke="#3b82f6" fill="url(#contributionsGradient)" name="Contributions" strokeWidth={2} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#rothGradient)" name="Total Value" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-lg font-semibold mb-4">🎯 Portfolio Allocation</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={financialData.rothHoldings}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {financialData.rothHoldings.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#10b981', '#f59e0b', '#3b82f6'][index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {financialData.rothHoldings.map((holding, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-sm text-slate-400">{holding.name} ({holding.percent}%)</span>
                      <span className="font-semibold text-emerald-400">{formatCurrency(holding.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>✅</span> 2025 Achievements
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-slate-300">Opened Roth IRA & contributed $10,289</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-slate-300">Never carried credit card balance</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-slate-300">Maintained automatic savings ($600/mo)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-slate-300">Generated $101k+ in sales revenue</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debt Tab */}
        {activeTab === 'debt' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Debt"
                value={formatCurrency(totalDebts)}
                subtitle="Est. remaining"
                color="red"
              />
              <StatCard
                title="Auto Loan"
                value={formatCurrency(financialData.currentBalances.autoLoan)}
                subtitle="5.44% APR"
                color="amber"
              />
              <StatCard
                title="Student Loans"
                value={formatCurrency(financialData.currentBalances.studentLoans)}
                subtitle="Federal loans"
                color="purple"
              />
              <StatCard
                title="2025 Interest"
                value={formatCurrency(2351)}
                subtitle="Student loans (1098-E)"
                color="blue"
              />
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📊</span> Debt Avalanche Strategy
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold text-red-400">1. Auto Loan (Wells Fargo)</span>
                      <p className="text-xs text-slate-500">Highest interest - priority target</p>
                    </div>
                    <span className="text-xl font-bold text-red-400">5.44%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Monthly payment: ~$457</span>
                    <span className="text-slate-400">Remaining: {formatCurrency(financialData.currentBalances.autoLoan)}</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold text-amber-400">2. Student Loans (EdFinancial)</span>
                      <p className="text-xs text-slate-500">Lower rate - minimum payments</p>
                    </div>
                    <span className="text-xl font-bold text-amber-400">~4-5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Monthly payment: ~$400</span>
                    <span className="text-slate-400">Remaining: {formatCurrency(financialData.currentBalances.studentLoans)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📅</span> Projected Debt-Free Timeline
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700"></div>
                <div className="space-y-6 pl-12">
                  <div className="relative">
                    <div className="absolute -left-8 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-900"></div>
                    <div>
                      <p className="font-semibold text-slate-300">Today (Jan 2026)</p>
                      <p className="text-sm text-slate-500">Total debt: {formatCurrency(totalDebts)}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 w-4 h-4 bg-amber-500 rounded-full border-4 border-slate-900"></div>
                    <div>
                      <p className="font-semibold text-slate-300">{debtProjection.autoPayoffDate}</p>
                      <p className="text-sm text-slate-500">Auto loan paid off</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 w-4 h-4 bg-blue-500 rounded-full border-4 border-slate-900"></div>
                    <div>
                      <p className="font-semibold text-slate-300">{debtProjection.debtFreeDate}</p>
                      <p className="text-sm text-slate-500">All debt paid off</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 w-4 h-4 bg-purple-500 rounded-full border-4 border-slate-900"></div>
                    <div>
                      <p className="font-semibold text-emerald-400 text-lg">DEBT FREE 🎉</p>
                      <p className="text-sm text-slate-500">Full financial freedom</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/50">
              <h2 className="text-3xl font-bold mb-2">🎯 Primary Goal</h2>
              <p className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-4">
                ${financialData.wealthGoal.target.toLocaleString()}
              </p>
              <p className="text-slate-400 text-lg mb-6">Net Worth by {financialData.wealthGoal.targetDate}</p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Current Net Worth</p>
                  <p className="text-2xl font-bold text-red-400">{formatCurrency(netWorth)}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Required Growth</p>
                  <p className="text-2xl font-bold text-emerald-400">{formatCurrency(financialData.wealthGoal.target - netWorth)}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Months Remaining</p>
                  <p className="text-2xl font-bold text-blue-400">55</p>
                </div>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">Progress to Goal</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    {(((netWorth - (-42213)) / (financialData.wealthGoal.target - (-42213))) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(0, ((netWorth - (-42213)) / (financialData.wealthGoal.target - (-42213))) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-lg font-semibold mb-4">🚀 2026 Targets</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-amber-400">○</span>
                    <span className="text-slate-300">Max Roth IRA ($7,000)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-amber-400">○</span>
                    <span className="text-slate-300">Build 6-month emergency fund</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-amber-400">○</span>
                    <span className="text-slate-300">Pay down auto loan aggressively</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-amber-400">○</span>
                    <span className="text-slate-300">Target $100k salary (job transition)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-amber-400">○</span>
                    <span className="text-slate-300">Net worth positive by Dec 2026</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-lg font-semibold mb-4">💡 Strategy Notes</h2>
                <div className="space-y-4 text-sm text-slate-300">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="font-semibold text-blue-400 mb-1">Phase 1: Emergency Fund</p>
                    <p className="text-slate-400">Build 6-month cushion in TD Savings (~$18k target)</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p className="font-semibold text-purple-400 mb-1">Phase 2: Debt Avalanche</p>
                    <p className="text-slate-400">Attack auto loan (5.44%) with extra payments</p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <p className="font-semibold text-emerald-400 mb-1">Phase 3: Wealth Building</p>
                    <p className="text-slate-400">Max Roth IRA + consider 401k after raise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-500">
            Data: Fidelity Roth IRA • Chase Checking • TD Savings • Chase United • Apple Card • 1098-E • W-2
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Built for aggressive wealth building with a 40-year time horizon
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
