export * from './pos';
export type { Order, OrderStatus, DeliveryStatus } from '../types/orders';
export type { CourierProvider } from '../types/courier';
export type { GetQueryParams } from '../types/orders';

export interface IIngredient {
  name: string;
  price: number;
}

export type GetQueryParams = {
  searchTerm?: string;
  sort?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
};

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  paymentMethod?: string;
  status?: string;
}

export type { ILogin, IRegister } from "./auth.type"

export interface IResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}

export interface ISidebarItem {
  title: string,
  items: {
    title: string,
    url: string,
    component: ComponentType
  }[]

}

export enum Role {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    MODERATOR = "MODERATOR",
    CUSTOMER = "CUSTOMER"
}
export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address: string;
    picture?: string;
    isActive?: IsActive;
    isVerified?: boolean;
    isDeleted?: boolean;
    salary?: number;
    role?: Role;
    createdAt?: string
    updatedAt?: string
}

export interface IUserApiResponse {
  data: IUser;
}

export enum CategoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface ICategory {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  status: CategoryStatus;
  productCount: number;
}

export enum BrandStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export interface IBrand {
  _id: string
    title: string;
    slug: string;
    description: string;
    image: string;
    productCount: number;
    status: BrandStatus;
}

export enum ProductStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

// ------ product ---
export interface IProduct {
    _id?: string;

    // Basic Info
    title: string;                  // e.g., "Aveeno Baby Sunscreen"
    brand: string;           // Reference to Brand collection
    category: string;        // Reference to Category collection
    size?: string;                  // e.g., "88ml"
    slug?: string;                  // URL-friendly slug

    // Pricing
    price: number;                  // e.g., 2350
    discountPrice?: number;         // optional discounted price
    buyingPrice?: number;

    // Stock / Availability
    totalAddedStock?: number;        // Total stock ever added for this product
    totalSold?: number;              // total stock sold
    availableStock?: number;         // calculated as totalAddedStock - totalSold
    status: ProductStatus;
    isDeleted?: boolean;
    // Media
    images: string[];               // Array of image URLs

    // Ratings & Reviews
    ratings?: number;               // average rating
    reviews?: {
        user: string;
        rating: number;
        comment: string;
        date: Date;
    }[];

    // Description
    description: string;            // Full product description

    // Optional meta
    createdAt?: Date;
    updatedAt?: Date;
}