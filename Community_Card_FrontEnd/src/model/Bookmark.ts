import { ProductSchema } from "./Product";

export interface CreateBookmarkSchema {
    customerId: number,
    productId: number,
}
export interface BookmarkSchema {
    customerId: number,
    products: ProductSchema[],
}