export interface UserSchema {
    email: string,
    password: string,
    phoneNumber: string,
    customerId: string,
    sellerId: string, // will be populated if user is a seller.
    address: AddressSchema,
}

export interface UserSessionSchema {
    sub: string,
    sellerId?: number,
    customerId?: number,
    role: "BUYER" | "SELLER",
    iat?: number,
    exp?: number,
}

export interface LocationSchema {
    lat: number,
    lng: number,
    elevation: number
}

export interface CreateCustomerSchema {
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    shopSlug: string,
    profilePhoto?: string,
}

export interface CustomerSchema extends CreateCustomerSchema {
    customerId: number,
}

export interface AddressSchema {
    address1: string,
    address2: string,
    district: string,
    city: string,
    state: string,
    pinCode: string,
    country: string,
    latitude: number,
    longitude: number,
    elevation: number
}