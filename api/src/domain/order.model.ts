export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export enum OrderEventType {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_UPDATED = 'ORDER_UPDATED',
  ORDER_COMPLETED = 'ORDER_COMPLETED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_FAILED = 'ORDER_FAILED',
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderEvent {
  orderId: string;
  eventType: OrderEventType;
  timestamp: Date;
  order?: Order;
  previousStatus?: OrderStatus;
  newStatus?: OrderStatus;
  metadata?: Record<string, unknown>;
}

export function createOrderEvent(
  orderId: string,
  eventType: OrderEventType,
  order?: Order,
  previousStatus?: OrderStatus,
  newStatus?: OrderStatus,
  metadata?: Record<string, unknown>,
): OrderEvent {
  return {
    orderId,
    eventType,
    timestamp: new Date(),
    order,
    previousStatus,
    newStatus,
    metadata,
  };
}

export function isValidOrderStatus(status: string): status is OrderStatus {
  return Object.values(OrderStatus).includes(status as OrderStatus);
}

export function isValidOrderEventType(type: string): type is OrderEventType {
  return Object.values(OrderEventType).includes(type as OrderEventType);
}