/**
 * Date Filtering Utilities for Seller Dashboard and Order Histories
 */

export const DATE_RANGE_OPTIONS = [
  { id: '7d', label: 'Last 7 Days', days: 7 },
  { id: '30d', label: 'Last 30 Days', days: 30 },
  { id: '90d', label: 'Last 90 Days', days: 90 },
  { id: '12m', label: 'Last 12 Months', days: 365 },
  { id: 'all', label: 'All Time (12M+)', days: null }
];

/**
 * Filters orders based on selected date range.
 * Uses the latest order date in the dataset as the reference "now" point
 * so that mock data always displays realistic trends regardless of current calendar year.
 */
export function filterOrdersByDateRange(orders = [], rangeId = '30d') {
  if (!orders || !orders.length) return [];
  if (rangeId === 'all') return orders;

  const option = DATE_RANGE_OPTIONS.find(o => o.id === rangeId) || DATE_RANGE_OPTIONS[1];
  if (!option.days) return orders;

  // Find maximum date in orders
  const timestamps = orders.map(o => new Date(o.date).getTime()).filter(t => !isNaN(t));
  if (!timestamps.length) return orders;

  const maxTimestamp = Math.max(...timestamps);
  const cutoffTimestamp = maxTimestamp - (option.days * 24 * 60 * 60 * 1000);

  return orders.filter(o => {
    const t = new Date(o.date).getTime();
    return t >= cutoffTimestamp;
  });
}

/**
 * Groups orders by date bucket (daily, weekly, monthly) for charts
 */
export function groupOrdersByTimeline(orders = [], rangeId = '30d') {
  if (!orders.length) return [];

  // Sort chronologically
  const sorted = [...orders].sort((a, b) => new Date(a.date) - new Date(b.date));

  if (rangeId === '7d' || rangeId === '30d') {
    // Group by Day (YYYY-MM-DD or Mon DD)
    const dailyMap = {};
    sorted.forEach(order => {
      const d = new Date(order.date);
      const label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      if (!dailyMap[label]) {
        dailyMap[label] = { date: label, revenue: 0, orders: 0, profit: 0, units: 0 };
      }
      dailyMap[label].revenue += order.totalAmount || 0;
      dailyMap[label].profit += order.estimatedNetProfit || Math.round((order.totalAmount || 0) * 0.22);
      dailyMap[label].orders += 1;
      dailyMap[label].units += order.items ? order.items.reduce((s, i) => s + i.quantity, 0) : 1;
    });
    return Object.values(dailyMap);
  }

  // Otherwise group by Month (e.g. "Jan", "Feb", etc.)
  const monthMap = {};
  sorted.forEach(order => {
    const d = new Date(order.date);
    const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    if (!monthMap[label]) {
      monthMap[label] = { date: label, revenue: 0, orders: 0, profit: 0, units: 0 };
    }
    monthMap[label].revenue += order.totalAmount || 0;
    monthMap[label].profit += order.estimatedNetProfit || Math.round((order.totalAmount || 0) * 0.22);
    monthMap[label].orders += 1;
    monthMap[label].units += order.items ? order.items.reduce((s, i) => s + i.quantity, 0) : 1;
  });
  return Object.values(monthMap);
}
