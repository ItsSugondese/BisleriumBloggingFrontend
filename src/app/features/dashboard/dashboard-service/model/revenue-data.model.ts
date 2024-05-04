export interface RevenueDataPayload {
    fromDate?: string,
    toDate?: string,
    isAll ?: boolean
  }

export interface RevenueData {
    revenue: number;
    paidAmount: number;
    leftToPay: number;
    deliveredOrder: number;
  }
  