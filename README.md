# ShopSense AI — Smart E-Commerce Platform with ValueScore & Seller Profit Intelligence

> **MBA Final-Year Project in Information Technology, Business Intelligence & Data Analytics**  
> *Tagline: "Shop Smarter. Understand Value. Grow Profit."*

---

## 📌 Executive Summary

**ShopSense AI** is a modern, responsive frontend-only e-commerce web platform that unites the customer shopping journey of Amazon and Flipkart with the analytical depth of an enterprise SaaS business intelligence platform.

The application introduces two distinct innovations:
1. **ValueScore Engine**: An explainable, multi-attribute decision model (0–100) that normalizes price competitiveness, verified ratings, feature density, quality/return rates, and manufacturer warranties to guide informed consumer purchases.
2. **Seller Profit Intelligence**: An operational management accounting suite that exposes true net margins, deducting Cost of Goods Sold (COGS), marketplace commission fees, shipping, reverse logistics losses, and overhead. Includes an interactive pricing and break-even simulator and deterministic rule-based demo insights.

---

## 🚀 Key Features

### For Customers
- **Comprehensive Catalog**: 32+ rich products across 8 categories (Smartphones, Laptops, Audio, Fitness, Electronics, Office, Home, Fashion).
- **Faceted Search & Filters**: Live keyword search, multi-category selection, price sliders (up to ₹1,20,000), minimum rating filters, and minimum ValueScore thresholds.
- **Product Details & ValueScore Gauge**: Circular progress gauge, 5-factor breakdown bars, and a deterministic *"Why this score?"* rationale.
- **Product Comparison Center**: Side-by-side spec matrix comparing up to 4 items simultaneously with Recharts bar comparison charts.
- **ValueScore Studio**: Dedicated customization lab with sliders to reweight factor priorities (validated to 100%) and view live radar & ranking charts.
- **Shopping Cart & Checkout**: Live quantity steppers, coupon codes (`SHOPSENSE10`, `VALUE20`), free shipping thresholds (over ₹1,000), multi-step validated checkout, and simulated invoice download.
- **Saved Wishlist & Order History**: LocalStorage-persisted cart, wishlist, and past orders ledger.

### For Sellers
- **Executive KPI Dashboard**: Gross Sales (GMV), COGS, Platform Fees, Estimated Net Profit, Net Margin %, Orders Count, and Average Order Value (AOV).
- **Product Profit Ledger**: Full SKU accounting table displaying selling price, cost price, fees, return losses, net profit, and margin categories.
- **Sales Analytics**: Revenue progression over time, order volume frequencies, and fulfillment statuses (Delivered, Shipped, Returned).
- **Profit Intelligence & Cost Diagnostics**: Waterfall breakdown of capital deductions and detection of high-sales margin compression vulnerabilities.
- **Interactive Pricing Simulator**: Sensitivity sandbox modeling price elasticity, calculating Break-Even Selling Price and Target 20% Net Margin Price.
- **Inventory Velocity & Alerts**: Stock coverage in days, sales velocity per month, and low-stock reorder warnings.
- **Data Reports & CSV Export**: Browser-side CSV generation for Transactions, Product Profit Ledgers, and Warehouse Valuations.
- **AI-Inspired Demo Insights**: Rule-based deterministic insights flagging top drivers, margin compression, and loss-making items.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **Data Visualization**: Recharts (Line, Area, Bar, Pie, Radar charts)
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage` (Cart, Wishlist, Compare Tray, Custom Factor Weights, Orders)
- **Currency**: Indian Rupee (`₹`) with localized formatting conventions

---

## 📐 Mathematical & Accounting Methodology

### 1. ValueScore Formula
$$\text{ValueScore} = \sum_{i=1}^{5} (w_i \cdot S_i)$$
Where:
- $S_{\text{price}} = 60 + 0.5 \times \left[ \frac{P_{\text{bench}} - P}{P_{\text{bench}}} \times 100 \right]$ (30% weight)
- $S_{\text{rating}} = \left(\frac{R}{5.0} \times 80\right) + \min\left(20, \log_{10}(\text{Reviews} + 1) \times 5.5\right)$ (25% weight)
- $S_{\text{feature}} = \left[\frac{\text{FeatureScore}}{\max(0.4, P / P_{\text{bench}})}\right] \times 0.88$ (20% weight)
- $S_{\text{quality}} = (\text{Quality} \times 0.7) + [100 - (\text{ReturnRate} \times 4)] \times 0.3$ (15% weight)
- $S_{\text{warranty}} = \min(100, (\text{WarrantyMonths} / 24) \times 100)$ (10% weight)

**Score Bands**:
- `85–100`: **Excellent Value** (Emerald)
- `70–84`: **Good Value** (Blue)
- `50–69`: **Average Value** (Amber)
- `< 50`: **Compare Before Buying** (Rose)

### 2. Seller Profit Accounting Model
- **Gross Revenue**: $\sum (\text{Selling Price} \times \text{Units Sold})$
- **COGS**: $\sum (\text{Unit Cost} \times \text{Units Sold})$
- **Platform Fees**: $\text{Gross Revenue} \times (\text{Fee Rate \%} / 100)$
- **Shipping Costs**: $\sum (\text{Shipping Per Unit} \times \text{Units Sold})$
- **Return Loss**: $\text{Units} \times (\text{Return Rate \%} / 100) \times (0.25 \times \text{Selling Price} + \text{Unit Shipping})$
- **Operating Overheads**: $\text{Gross Revenue} \times 0.02$
- **Estimated Net Profit**: $\text{Gross Revenue} - \text{COGS} - \text{Fees} - \text{Shipping} - \text{Return Losses} - \text{Overheads}$
- **Net Margin \%**: $(\text{Net Profit} / \text{Gross Revenue}) \times 100$

### 3. Pricing Simulator Formulas
$$\text{Break-Even Price} = \frac{\text{Unit Cost} + \text{Shipping} + \frac{\text{Fixed Overhead}}{\text{Units}}}{1 - \text{Fee Rate}}$$
$$\text{Target 20\% Margin Price} = \frac{\text{Unit Cost} + \text{Shipping} + \frac{\text{Fixed Overhead}}{\text{Units}}}{1 - \text{Fee Rate} - 0.20}$$

---

## 💻 Running the Project Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation Steps
```bash
# 1. Clone or open the workspace folder
cd "DA ecomerce"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📂 Project Directory Structure

```
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   └── DemoDisclaimerBanner.jsx
    │   ├── product/
    │   │   ├── ProductCard.jsx
    │   │   └── ValueScoreBadge.jsx
    │   ├── compare/
    │   │   └── CompareDrawer.jsx
    │   └── seller/
    │       └── SellerLayout.jsx
    ├── context/
    │   ├── CartContext.jsx
    │   ├── WishlistContext.jsx
    │   ├── CompareContext.jsx
    │   └── ValueScoreContext.jsx
    ├── data/
    │   ├── products.js       # 32+ rich items with pricing, costs, specs
    │   ├── orders.js         # 130 mock orders spanning 12 months
    │   ├── sellers.js        # TechNest seller profile & metrics
    │   └── benchmarks.js     # Category pricing and margin benchmarks
    ├── utils/
    │   ├── formatCurrency.js # Indian Rupee (₹) and compact numbers
    │   ├── valueScore.js     # 5-factor scoring engine and explanations
    │   ├── profitCalculations.js # Financial ledger and pricing simulator
    │   ├── dateFilters.js    # 7d, 30d, 90d, 12m timeline groupings
    │   └── csvExport.js      # Client-side CSV generator via Blob
    └── pages/
        ├── Home.jsx
        ├── Products.jsx
        ├── ProductDetails.jsx
        ├── CompareProducts.jsx
        ├── ValueScore.jsx
        ├── Cart.jsx
        ├── Checkout.jsx
        ├── OrderSuccess.jsx
        ├── Wishlist.jsx
        ├── Account.jsx
        ├── About.jsx
        ├── Methodology.jsx
        ├── NotFound.jsx
        └── seller/
            ├── SellerDashboard.jsx
            ├── SellerProducts.jsx
            ├── SalesAnalytics.jsx
            ├── ProfitIntelligence.jsx
            ├── PricingInsights.jsx
            ├── InventoryInsights.jsx
            └── Reports.jsx
```

---

## ⚠️ Academic Disclaimer

This web application is built strictly as an academic prototype for evaluating decision support systems and business intelligence architectures in e-commerce. All data points, transactions, scoring outcomes, and financial margin predictions are computed client-side using deterministic mathematical formulas and realistic sample data. No actual payments, shipments, or backend services are involved.
