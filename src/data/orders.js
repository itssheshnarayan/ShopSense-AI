import { PRODUCTS } from './products';

// Cities for realistic order origins
const CITIES = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh'];
const CUSTOMER_NAMES = [
  'Aarav Sharma', 'Diya Patel', 'Rohan Verma', 'Ananya Iyer', 'Vikram Singh',
  'Pooja Nair', 'Kunal Malhotra', 'Sneha Rao', 'Aditya Joshi', 'Meera Kapoor',
  'Siddharth Reddy', 'Neha Choudhury', 'Rahul Mukherjee', 'Kavita Das', 'Arjun Saxena'
];
const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery'];

/**
 * Deterministic PRNG to generate 130 realistic orders distributed across 365 days
 */
function createDeterministicOrders() {
  const orders = [];
  const baseDate = new Date('2024-10-15T12:00:00Z'); // Reference recent anchor
  let seed = 12345;
  function random() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // 130 orders spaced across the prior 360 days
  for (let i = 1; i <= 130; i++) {
    const daysAgo = Math.floor(Math.pow(random(), 1.4) * 350); // Weighted towards more recent dates
    const orderDate = new Date(baseDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - (Math.floor(random() * 86400000)));
    
    // Pick 1 to 3 items
    const itemCount = random() > 0.8 ? 2 : 1;
    const items = [];
    let orderTotal = 0;
    let orderProfit = 0;

    for (let j = 0; j < itemCount; j++) {
      const prodIndex = Math.floor(random() * PRODUCTS.length);
      const prod = PRODUCTS[prodIndex];
      const qty = random() > 0.85 ? 2 : 1;
      const returned = random() < ((prod.returnRate || 5) / 100);

      const itemRev = prod.sellingPrice * qty;
      const itemCost = prod.unitCost * qty;
      const itemFee = itemRev * (prod.platformFeePct / 100);
      const itemShip = prod.shippingCost * qty;
      const itemReturnCost = returned ? (itemRev * 0.25 + itemShip) : 0;
      const itemOperating = itemRev * 0.02;
      const itemProfit = itemRev - itemCost - itemFee - itemShip - itemReturnCost - itemOperating;

      orderTotal += itemRev;
      orderProfit += itemProfit;

      items.push({
        productId: prod.id,
        productName: prod.name,
        category: prod.category,
        quantity: qty,
        unitPrice: prod.sellingPrice,
        unitCost: prod.unitCost,
        platformFee: Math.round(itemFee),
        shippingCost: itemShip,
        returned
      });
    }

    const isReturned = items.some(it => it.returned);
    const status = isReturned ? 'Returned' : (daysAgo < 3 ? 'Shipped' : 'Delivered');

    orders.push({
      orderId: `SS-2024-${String(1000 + i)}`,
      date: orderDate.toISOString(),
      customerName: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length],
      customerCity: CITIES[i % CITIES.length],
      status,
      items,
      totalAmount: Math.round(orderTotal),
      estimatedNetProfit: Math.round(orderProfit),
      paymentMethod: PAYMENT_METHODS[i % PAYMENT_METHODS.length]
    });
  }

  // Sort orders descending by date (newest first)
  return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const MOCK_ORDERS = createDeterministicOrders();
