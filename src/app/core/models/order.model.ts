// server returns OffsetDateTime; treat as ISO string in TS
export interface AdminOrderSummary {
    id: number;
    userEmail: string;
    createdAt: string; // ISO date-time
}

export interface OrderDto {
    id: number;
    createdAt: string; // ISO date-time
}

export interface OrderLine {
    productId: number;
    productName: string;
    quantity: number;
    lineTotal: number; // BigDecimal -> number
}
