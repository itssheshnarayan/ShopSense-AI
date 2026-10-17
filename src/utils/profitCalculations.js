/**
 * Seller Profit Intelligence Accounting & Analytical Functions
 * ShopSense AI — MBA Final Year Project
 */

/**
 * Calculates financial metrics for a single product record given sales volume.
 */
export function calculateProductFinancials(product, unitsSold = 0, customFeeRate = null) {
  if (!product) return null;

  const units = Math.max(0, Number(unitsSold || 0));
  const sellingPrice = Number(product.sellingPrice || 0);
  const unitCost = Number(product.unitCost || (sellingPrice * 0.7)); // fallback ~70% cost
  const shippingPerUnit = Number(product.shippingCost || 120);
  const feeRatePct = customFeeRate !== null 
    ? Number(customFeeRate) 
    : Number(product.platformFeePct || 9.0);
  const returnRatePct = Number(product.returnRate || 5.0);

  const grossRevenue = sellingPrice * units;
  const cogs = unitCost * units;
  const platformFees = grossRevenue * (feeRatePct / 100);
  const shippingCost = shippingPerUnit * units;
  // Return costs: packaging, reverse shipping, and minor refurbishing loss (~25% of retail per returned item)
  const returnCost = (units * (returnRatePct / 100)) * (sellingPrice * 0.25 + shippingPerUnit);
  // Other operating & packaging allocations (~2% of gross revenue)
  const operatingCosts = grossRevenue * 0.02;

  const totalExpenses = cogs + platformFees + shippingCost + returnCost + operatingCosts;
  const netProfit = grossRevenue - totalExpenses;
  const profitMarginPct = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
  const unitNetProfit = units > 0 ? netProfit / units : (sellingPrice - unitCost - (sellingPrice * feeRatePct / 100) - shippingPerUnit);

  return {
    productId: product.id,
    name: product.name,
    category: product.category,
    sellingPrice,
    unitCost,
    unitsSold: units,
    grossRevenue,
    cogs,
    platformFees,
    feeRatePct,
    shippingCost,
    returnCost,
    returnRatePct,
    operatingCosts,
    totalExpenses,
    netProfit,
    profitMarginPct: Number(profitMarginPct.toFixed(2)),
    unitNetProfit: Number(unitNetProfit.toFixed(2)),
    isProfitable: netProfit > 0,
    marginCategory: getMarginCategory(profitMarginPct)
  };
}

/**
 * Aggregates portfolio financials across all products and their sold units.
 */
export function calculatePortfolioFinancials(products = [], orderItems = []) {
  // Map units sold per product
  const unitsMap = {};
  orderItems.forEach(item => {
    unitsMap[item.productId] = (unitsMap[item.productId] || 0) + (item.quantity || 1);
  });

  const productMetrics = products.map(p => {
    const units = unitsMap[p.id] !== undefined ? unitsMap[p.id] : (p.demoUnitsSold || 15);
    return calculateProductFinancials(p, units);
  });

  const totals = productMetrics.reduce((acc, curr) => {
    acc.grossRevenue += curr.grossRevenue;
    acc.cogs += curr.cogs;
    acc.platformFees += curr.platformFees;
    acc.shippingCost += curr.shippingCost;
    acc.returnCost += curr.returnCost;
    acc.operatingCosts += curr.operatingCosts;
    acc.totalExpenses += curr.totalExpenses;
    acc.netProfit += curr.netProfit;
    acc.unitsSold += curr.unitsSold;
    return acc;
  }, {
    grossRevenue: 0,
    cogs: 0,
    platformFees: 0,
    shippingCost: 0,
    returnCost: 0,
    operatingCosts: 0,
    totalExpenses: 0,
    netProfit: 0,
    unitsSold: 0
  });

  const overallMarginPct = totals.grossRevenue > 0 
    ? (totals.netProfit / totals.grossRevenue) * 100 
    : 0;

  const totalOrders = orderItems.length > 0 ? new Set(orderItems.map(i => i.orderId)).size : 124;
  const aov = totalOrders > 0 ? totals.grossRevenue / totalOrders : 0;

  return {
    ...totals,
    profitMarginPct: Number(overallMarginPct.toFixed(2)),
    totalOrders,
    averageOrderValue: Math.round(aov),
    productMetrics,
    topProfitProduct: [...productMetrics].sort((a, b) => b.netProfit - a.netProfit)[0],
    lowestMarginProduct: [...productMetrics].filter(p => p.grossRevenue > 0).sort((a, b) => a.profitMarginPct - b.profitMarginPct)[0]
  };
}

/**
 * Classifies profit margin into clear operational bands
 */
export function getMarginCategory(marginPct) {
  if (marginPct >= 25) {
    return { label: 'High Margin', color: 'emerald', bg: 'bg-emerald-100 text-emerald-800' };
  }
  if (marginPct >= 12) {
    return { label: 'Healthy Margin', color: 'blue', bg: 'bg-blue-100 text-blue-800' };
  }
  if (marginPct >= 3) {
    return { label: 'Low Margin', color: 'amber', bg: 'bg-amber-100 text-amber-800' };
  }
  return { label: 'Negative Margin', color: 'rose', bg: 'bg-rose-100 text-rose-800' };
}

/**
 * Pricing Simulator Model
 * Calculates current vs proposed scenarios, break-even price, and target margin price.
 */
export function simulatePricingScenario({
  currentPrice,
  unitCost,
  currentUnits,
  proposedPrice,
  platformFeePct = 9.0,
  shippingCost = 120,
  demandElasticityPct = 0, // e.g. -10% volume change
  fixedOverhead = 25000
}) {
  const cPrice = Number(currentPrice);
  const pPrice = Number(proposedPrice);
  const cost = Number(unitCost);
  const feeRate = Number(platformFeePct) / 100;
  const ship = Number(shippingCost);
  const cUnits = Math.max(1, Number(currentUnits));

  // Projected units under proposed price accounting for demand sensitivity
  const elasticityFactor = 1 + (Number(demandElasticityPct) / 100);
  const pUnits = Math.max(1, Math.round(cUnits * elasticityFactor));

  // Current Scenario
  const currentRevenue = cPrice * cUnits;
  const currentExpenses = (cost * cUnits) + (currentRevenue * feeRate) + (ship * cUnits) + fixedOverhead;
  const currentNetProfit = currentRevenue - currentExpenses;
  const currentMargin = currentRevenue > 0 ? (currentNetProfit / currentRevenue) * 100 : 0;

  // Proposed Scenario
  const proposedRevenue = pPrice * pUnits;
  const proposedExpenses = (cost * pUnits) + (proposedRevenue * feeRate) + (ship * pUnits) + fixedOverhead;
  const proposedNetProfit = proposedRevenue - proposedExpenses;
  const proposedMargin = proposedRevenue > 0 ? (proposedNetProfit / proposedRevenue) * 100 : 0;

  // Break-Even Price Calculation:
  // Revenue = Expenses => P * Q = (cost * Q) + (P * Q * feeRate) + (ship * Q) + fixedOverhead
  // P * Q * (1 - feeRate) = Q * (cost + ship) + fixedOverhead
  // Break-even P = [cost + ship + (fixedOverhead / Q)] / (1 - feeRate)
  const breakEvenPrice = (cost + ship + (fixedOverhead / pUnits)) / Math.max(0.01, (1 - feeRate));

  // Target 20% Margin Price Calculation:
  // Margin = (Revenue - Expenses) / Revenue = TargetRate
  // Revenue * (1 - TargetRate) = Expenses
  // P * Q * (1 - TargetRate - feeRate) = Q * (cost + ship) + fixedOverhead
  const targetRate = 0.20; // 20% target
  const targetMarginPrice = (cost + ship + (fixedOverhead / pUnits)) / Math.max(0.01, (1 - feeRate - targetRate));

  return {
    current: {
      price: cPrice,
      units: cUnits,
      revenue: Math.round(currentRevenue),
      expenses: Math.round(currentExpenses),
      netProfit: Math.round(currentNetProfit),
      marginPct: Number(currentMargin.toFixed(2))
    },
    proposed: {
      price: pPrice,
      units: pUnits,
      revenue: Math.round(proposedRevenue),
      expenses: Math.round(proposedExpenses),
      netProfit: Math.round(proposedNetProfit),
      marginPct: Number(proposedMargin.toFixed(2)),
      profitDelta: Math.round(proposedNetProfit - currentNetProfit),
      marginDelta: Number((proposedMargin - currentMargin).toFixed(2))
    },
    breakEvenPrice: Math.round(breakEvenPrice),
    targetMarginPrice: Math.round(targetMarginPrice)
  };
}

/**
 * Generates deterministic, rule-based AI-Inspired Demo Insights
 * grounded strictly in actual computed metrics.
 */
export function generateSellerInsights(portfolioData, productMetrics) {
  if (!portfolioData || !productMetrics || !productMetrics.length) {
    return [];
  }

  const insights = [];

  // 1. Highest Profit Leader
  const topProfit = portfolioData.topProfitProduct;
  if (topProfit) {
    insights.push({
      id: 'top-profit',
      type: 'positive',
      title: 'Top Profit Driver Identified',
      description: `"${topProfit.name}" delivers ₹${Math.round(topProfit.netProfit).toLocaleString('en-IN')} in net profit with a strong ${topProfit.profitMarginPct}% margin. Recommend maintaining priority inventory and featured ad placement.`,
      metric: `₹${Math.round(topProfit.netProfit).toLocaleString('en-IN')} Profit`,
      action: 'Prioritize Stock'
    });
  }

  // 2. High Revenue but Margin Compression Alert
  const highRevLowMargin = productMetrics.find(p => p.grossRevenue > 100000 && p.profitMarginPct < 10);
  if (highRevLowMargin) {
    insights.push({
      id: 'margin-compression',
      type: 'warning',
      title: 'High Sales Volume with Margin Compression',
      description: `"${highRevLowMargin.name}" generated ₹${Math.round(highRevLowMargin.grossRevenue).toLocaleString('en-IN')} in revenue, but yields only a ${highRevLowMargin.profitMarginPct}% net margin due to high COGS and packaging fees.`,
      metric: `${highRevLowMargin.profitMarginPct}% Margin`,
      action: 'Simulate Price Hike'
    });
  }

  // 3. Loss-Making / Negative Net Margin Detection
  const lossMaker = productMetrics.find(p => p.netProfit < 0);
  if (lossMaker) {
    insights.push({
      id: 'loss-alert',
      type: 'critical',
      title: 'Negative Margin Detection',
      description: `"${lossMaker.name}" is currently operating at a net loss of ₹${Math.abs(Math.round(lossMaker.netProfit)).toLocaleString('en-IN')} after factoring in reverse logistics and return rates (${lossMaker.returnRatePct}%).`,
      metric: `-₹${Math.abs(Math.round(lossMaker.netProfit)).toLocaleString('en-IN')}`,
      action: 'Review Pricing & Returns'
    });
  }

  // 4. Return Rate Optimization
  const highReturn = productMetrics.find(p => p.returnRatePct > 10 && p.unitsSold > 10);
  if (highReturn) {
    insights.push({
      id: 'return-alert',
      type: 'info',
      title: 'Elevated Return Rate Detected',
      description: `"${highReturn.name}" experiences an above-average return rate of ${highReturn.returnRatePct}%, costing ₹${Math.round(highReturn.returnCost).toLocaleString('en-IN')} in reverse fulfillment and packaging loss.`,
      metric: `${highReturn.returnRatePct}% Return Rate`,
      action: 'Inspect Quality & Sizing'
    });
  }

  // 5. Portfolio Health Summary
  insights.push({
    id: 'portfolio-health',
    type: portfolioData.profitMarginPct >= 18 ? 'positive' : 'info',
    title: 'Portfolio Profit Efficiency',
    description: `Overall catalog is yielding a ${portfolioData.profitMarginPct}% net profit margin on ₹${Math.round(portfolioData.grossRevenue).toLocaleString('en-IN')} gross sales. Category benchmark sits at ~21.5%.`,
    metric: `${portfolioData.profitMarginPct}% Avg Margin`,
    action: 'View Category Breakdown'
  });

  return insights;
}
