import { ProductSchema } from "./Product"

export interface AddToCartSchema {
    product: ProductSchema,
    quantity: number,
}

export interface CartItem extends AddToCartSchema {
    cartItemId: number,
}

export interface CartViewSchema {
    cartId: number,
    customerId: number,
    items: CartItem[],
}