export interface CreateCategorySchema {
    categoryName: string;
    categoryDescription: string;
    categorySlug: string;
    catIconUrl: string;
}

export interface CategorySchema extends CreateCategorySchema {
    categoryId: number;
}

export interface UpdateCategorySchema {
    categoryId: number;
    categoryName?: string;
    categoryDescription?: string;
    catIconUrl?: string;
    categorySlug?: string;
}