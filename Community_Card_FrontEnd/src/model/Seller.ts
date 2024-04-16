import { AddressSchema } from "./User";

export interface CreateSellerSchema {
    email: string,
    password: string,
    name: string,
    shopName: string,
    aadhaarNo: string,
    phoneNumber: string,
    shopSlug: string,
}

export interface SellerSchema {
    sellerId:       number;
    email:          string;
    name:           string;
    contactPhoneNo: string;
    aadharNo:       string;
    password:       string | null;
    shopPhotoUrl:   string;
    shopName:       string;
    address:        AddressSchema;
    gstin:          string;
}

export interface UpdateSellerSchema extends Partial<SellerSchema> {
    sellerId: number
}