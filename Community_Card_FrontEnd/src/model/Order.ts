import { AddressSchema } from "./User";
import { ProductSchema } from "./Product";

export type StatusEnum = "placed" | "packed" | "shipped" | "delivered" | "cancelled"
export type PaymentMethod = "COD" | "ONLINE"


export interface OrderItemSchema {
    orderItemId: number;
    quantity: number;
    product: ProductSchema;
    totalPrice: number;
    itemPrice: number;
}

export interface CreateOrderSchema {
    customerId: number;
    paymentMethod: PaymentMethod;
    sessionId?: string;
}

export interface OrderSchema extends CreateOrderSchema {
    sellerId: number;
    orderId: number,
    paid: boolean;
    deliveryDate: string;
    deliveredAt: string;
    status: StatusEnum;
    createdAt: Date;
    totalPrice: number;
    shippingCharges: number;
    sessionId: string;
    shippingAddress: AddressSchema;
    items: OrderItemSchema[];
}

export interface UpdateOrderSchema {
    orderId: number,
    paid?: boolean;
    deliveryDate?: string;
    deliveredAt?: string;
    status?: StatusEnum;
}
