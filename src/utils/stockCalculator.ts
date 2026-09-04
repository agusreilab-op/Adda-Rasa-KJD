import { Product, Transaction, StockHealthStatus } from '../types';

export interface ProductStockSummary {
  productId: string;
  code: string;
  name: string;
  initialStock: number;
  totalIn: number;
  totalOut: number;
  totalReturIn: number;
  totalReturOut: number;
  currentStock: number;
  minStock: number;
  health: StockHealthStatus;
}

/**
 * Calculates the accurate real physical stock for a single product.
 * Formula:
 * - If product has transaction history:
 *     currentStock = Math.max(0, initialStock + sum(IN) + sum(RETUR_IN) - sum(OUT) - sum(RETUR_OUT))
 * - If no transactions exist: currentStock = p.currentStock !== undefined ? p.currentStock : (p.initialStock || 0)
 */
interface AggregatedTransactionCounts {
  totalIn: number;
  totalOut: number;
  totalReturIn: number;
  totalReturOut: number;
  hasTransactions: boolean;
}

/**
 * Builds a fast indexed lookup for transactions to avoid O(N*M) nested loops on mobile.
 */
export function buildTransactionIndex(transactions: Transaction[] = []) {
  const byId = new Map<string, AggregatedTransactionCounts>();
  const byCode = new Map<string, AggregatedTransactionCounts>();
  const byName = new Map<string, AggregatedTransactionCounts>();

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return { byId, byCode, byName };
  }

  for (let i = 0; i < transactions.length; i++) {
    const t = transactions[i];
    const qty = Number(t.quantity) || 0;
    const type = t.type;

    const applyToMap = (map: Map<string, AggregatedTransactionCounts>, key: string) => {
      let rec = map.get(key);
      if (!rec) {
        rec = { totalIn: 0, totalOut: 0, totalReturIn: 0, totalReturOut: 0, hasTransactions: true };
        map.set(key, rec);
      }
      if (type === 'IN') rec.totalIn += qty;
      else if (type === 'OUT') rec.totalOut += qty;
      else if (type === 'RETUR_IN') rec.totalReturIn += qty;
      else if (type === 'RETUR_OUT') rec.totalReturOut += qty;
    };

    if (t.productId) {
      applyToMap(byId, t.productId);
    }
    if (t.productCode) {
      applyToMap(byCode, t.productCode.trim().toLowerCase());
    }
    if (t.productName) {
      applyToMap(byName, t.productName.trim().toLowerCase());
    }
  }

  return { byId, byCode, byName };
}

/**
 * Calculates the accurate real physical stock for a single product.
 * Supports passing precomputed transaction index for O(1) instantaneous lookup.
 */
export function getProductStockSummary(
  product: Product,
  transactions: Transaction[] = [],
  precomputedIndex?: ReturnType<typeof buildTransactionIndex>
): ProductStockSummary {
  const initialStock = Number(product.initialStock) || 0;
  const minStock = Number(product.minStock) || 0;

  let totalIn = 0;
  let totalOut = 0;
  let totalReturIn = 0;
  let totalReturOut = 0;
  let hasTransactions = false;

  const prodCode = (product.code || '').trim().toLowerCase();
  const prodName = (product.name || '').trim().toLowerCase();
  const prodId = product.id;

  if (precomputedIndex) {
    const match =
      (prodId ? precomputedIndex.byId.get(prodId) : undefined) ||
      (prodCode ? precomputedIndex.byCode.get(prodCode) : undefined) ||
      (prodName ? precomputedIndex.byName.get(prodName) : undefined);

    if (match) {
      totalIn = match.totalIn;
      totalOut = match.totalOut;
      totalReturIn = match.totalReturIn;
      totalReturOut = match.totalReturOut;
      hasTransactions = match.hasTransactions;
    }
  } else if (Array.isArray(transactions) && transactions.length > 0) {
    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];
      const matchId = prodId && t.productId && t.productId === prodId;
      const matchCode = prodCode && t.productCode && t.productCode.trim().toLowerCase() === prodCode;
      const matchName = prodName && t.productName && t.productName.trim().toLowerCase() === prodName;

      if (matchId || matchCode || matchName) {
        hasTransactions = true;
        const qty = Number(t.quantity) || 0;
        if (t.type === 'IN') {
          totalIn += qty;
        } else if (t.type === 'OUT') {
          totalOut += qty;
        } else if (t.type === 'RETUR_IN') {
          totalReturIn += qty;
        } else if (t.type === 'RETUR_OUT') {
          totalReturOut += qty;
        }
      }
    }
  }

  let currentStock: number;
  if (hasTransactions) {
    currentStock = Math.max(0, initialStock + totalIn + totalReturIn - totalOut - totalReturOut);
  } else if (typeof product.currentStock === 'number' && !isNaN(product.currentStock)) {
    currentStock = product.currentStock;
  } else {
    currentStock = initialStock;
  }

  let health: StockHealthStatus = 'Aman';
  if (currentStock <= 0) {
    health = 'Habis';
  } else if (currentStock <= minStock) {
    health = 'Menipis';
  }

  return {
    productId: product.id,
    code: product.code,
    name: product.name,
    initialStock,
    totalIn,
    totalOut,
    totalReturIn,
    totalReturOut,
    currentStock,
    minStock,
    health,
  };
}

/**
 * Gets just the current real physical stock number
 */
export function getRealStock(
  product: Product,
  transactions: Transaction[] = [],
  precomputedIndex?: ReturnType<typeof buildTransactionIndex>
): number {
  return getProductStockSummary(product, transactions, precomputedIndex).currentStock;
}

/**
 * Gets health status of the product based on real physical stock
 */
export function getProductStockHealth(
  product: Product,
  transactions: Transaction[] = [],
  precomputedIndex?: ReturnType<typeof buildTransactionIndex>
): StockHealthStatus {
  return getProductStockSummary(product, transactions, precomputedIndex).health;
}

/**
 * Calculates global inventory metrics across all products and transactions.
 * Uses single-pass O(N + M) aggregation for maximum performance and minimum battery/CPU usage.
 */
export function calculateInventoryMetrics(
  products: Product[],
  transactions: Transaction[] = [],
  precomputedIndex?: ReturnType<typeof buildTransactionIndex>
) {
  let totalStock = 0;
  let totalHealthy = 0;
  let totalLow = 0;
  let totalOut = 0;
  const criticalProducts: Product[] = [];

  // Use precomputed index or build index once in O(M)
  const index = precomputedIndex || buildTransactionIndex(transactions);

  // Single-pass calculation in O(N)
  const summaries = (products || []).map((p) => {
    const summary = getProductStockSummary(p, transactions, index);
    totalStock += summary.currentStock;

    if (summary.health === 'Habis') {
      totalOut++;
      criticalProducts.push(p);
    } else if (summary.health === 'Menipis') {
      totalLow++;
      criticalProducts.push(p);
    } else {
      totalHealthy++;
    }

    return summary;
  });

  let totalIn = 0;
  let totalOutUnits = 0;
  let totalReturInUnits = 0;
  let totalReturOutUnits = 0;
  let totalReturTransactions = 0;

  if (Array.isArray(transactions)) {
    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];
      const qty = Number(t.quantity) || 0;
      if (t.type === 'IN') {
        totalIn += qty;
      } else if (t.type === 'OUT') {
        totalOutUnits += qty;
      } else if (t.type === 'RETUR_IN') {
        totalReturInUnits += qty;
        totalReturTransactions++;
      } else if (t.type === 'RETUR_OUT') {
        totalReturOutUnits += qty;
        totalReturTransactions++;
      }
    }
  }

  return {
    totalProducts: products ? products.length : 0,
    totalStock,
    totalHealthy,
    totalLow,
    totalOut,
    criticalProducts,
    totalIn,
    totalOutUnits,
    totalReturInUnits,
    totalReturOutUnits,
    totalReturTransactions,
    summaries,
  };
}
