export interface AddReview {
    rating: number
    review: string
    productId: number
    customerId: number
}

export interface Review extends AddReview {
    cartItemId: number,
}