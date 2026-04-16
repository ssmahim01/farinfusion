'use client'
import React, {useState} from 'react';
import {useParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Grid3x3, LayoutGrid, List, Menu} from "lucide-react";
import {cn} from "@/lib/utils";
import ProductSideModal from "@/components/public-view/common/ProductSideModal";

type ViewMode = 'list' | 'grid-3' | 'grid-4';

type ProductFilterNavbarProps = {
    viewMode? : ViewMode ;
    setViewMode: (value: ViewMode) => void;
}

const ProductFilterNavbar = ({viewMode, setViewMode} : ProductFilterNavbarProps) => {
    const params = useParams();
    const slug = params?.slug as string;
    const [onModal, setOnModal] = React.useState(false);
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        sort: 'default',
    });
    return (
        <div>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between">
               <div className={"flex items-center justify-between "}>
                   <Button
                       className={"block lg:hidden cursor-pointer"}
                       variant={"outline"}
                       onClick={() => setOnModal(true)}
                   >
                       <Menu size={"lg"} />
                   </Button>
                   <h1 className="text-2xl font-bold">{slug}</h1>
               </div>

                <div className="flex items-center gap-4">

                    {/* VIEW MODE */}
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            onClick={() => setViewMode('list')}
                            className={cn(viewMode === 'list' && 'text-orange-500')}
                        >
                            <List />
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => setViewMode('grid-3')}
                            className={cn(viewMode === 'grid-3' && 'text-orange-500')}
                        >
                            <Grid3x3 />
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => setViewMode('grid-4')}
                            className={cn(viewMode === 'grid-4' && 'text-orange-500')}
                        >
                            <LayoutGrid />
                        </Button>
                    </div>

                    {/* SORT */}
                    <select
                        value={filters.sort}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                sort: e.target.value,
                            }))
                        }
                        className="px-4 py-2 border rounded-lg text-sm"
                    >
                        <option value="default">Default</option>
                        <option value="latest">Latest</option>
                        <option value="price-low">Low → High</option>
                        <option value="price-high">High → Low</option>
                    </select>
                </div>
            </div>
            {
                onModal && <ProductSideModal openModal={onModal} onChange={setOnModal} />
            }
        </div>
    );
};

export default ProductFilterNavbar;