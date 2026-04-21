
export interface CartItem {
    _id: string;
    slug: string;
    title: string;
    price: number;
    discountPrice: number;
    availableStock: number;
    quantity: number;
    images: string[];
}