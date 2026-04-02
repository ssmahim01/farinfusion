import { CourierProvider } from "./courier";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GetQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
export type DeliveryStatus =
  | "NOT_SHIPPED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED";

 export type CreateOrderPayload = {
  orderType: "POS" | "ONLINE" | "DELIVERY";
  paymentMethod?: "COD" | "ONLINE";

  products: {
    product: string;
    quantity: number;
  }[];

  shippingCost?: number;

  billingDetails: {
    fullName?: string;
    email: string;
    phone?: string;
    address?: string;
  };

  seller?: string;
};

export interface Order {
  _id: string;
  paymentMethod?: "COD" | "ONLINE" | "POS" | "BKASH" | "ROCKET" | "NAGAD" | "BANK";
  orderId?: string;
  customerName: string;
  customerEmail: string;
  billingDetails?: {
    fullName: string;
    email: string;
    address: string;
    phone: number;
  };
  customerPhone: string;
  totalPrice: number;
  products: {
    productId: string;
    product: {
        title: string
    },
    quantity: number;
    price: number;
  }
  total: number;
  orderStatus: OrderStatus;
  deliveryStatus: DeliveryStatus;
  courierName?: CourierProvider;
  trackingNumber?: string;
  items: OrderItem[];
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface UpdateOrderRequest {
  orderStatus?: OrderStatus;
  deliveryStatus?: DeliveryStatus;
  courierName?: CourierProvider;
  trackingNumber?: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  totalCount: number;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}
