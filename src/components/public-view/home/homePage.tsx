import React from 'react';
import CategoryList from "@/components/public-view/category/CategoryList";
import ProductList from "@/components/public-view/product/ProductList";

const HomePage = () => {
    return (
        <div className={"bg-gray-100"}>
            <div className={"max-w-7xl mx-auto px-5 py-5 sm:py10 space-y-5"}>
                <CategoryList />
                <ProductList />
            </div>
        </div>
    );
};

export default HomePage;