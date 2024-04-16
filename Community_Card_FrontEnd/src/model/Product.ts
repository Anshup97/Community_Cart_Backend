export interface ProductHighLevelFeatures {
  productName: string;
  productPrice: number;
  productQuantity: number;
}
export interface CreateProductSchema extends ProductHighLevelFeatures {
  productDescription: string;
  productSlug: string;
  productFeatured: boolean;
  categoryId: number;
  sellerId: number;
}

export interface ProductSchema extends CreateProductSchema {
  productId: number;
  productImageUrl?: string;
  rating: number;
  available: boolean;
}

export interface UpdateProductSchema {
  productId: number;
  productName?: string;
  productDescription?: string;
  productImageUrl?: string;
  productSlug?: string;
  productPrice?: number;
  productQuantity?: number;
  productFeatured?: boolean;
  categoryId?: number;
  sellerId?: number;
  rating?: number;
  available?: boolean;
}
