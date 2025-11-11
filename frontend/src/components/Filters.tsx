import { useGetFiltersMetaQuery } from "@/store/slices/productsApiSlice";
import { Checkbox } from "./ui/checkbox";
import { TrashIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface FiltersProps {
  selectedColors?: string[];
  selectedSizes?: string[];
  filterCount: number;
  minPrice: string;
  maxPrice: string;
  onFilterChange: (
    filterType: "color" | "size",
    value: string,
    isChecked: boolean
  ) => void;
  onPriceChange: (min: string, max: string) => void;
}
const Filters = ({
  selectedColors,
  selectedSizes,
  onFilterChange,
  filterCount,
  minPrice,
  maxPrice,
  onPriceChange,
}: FiltersProps) => {
  const { data } = useGetFiltersMetaQuery("");
  const navigate = useNavigate();
  const handleClearAllFilters = () => {
    navigate("/products", { replace: true });
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 bg-gray-100 px-4 py-3 border-b border-gray-200">
        <p className="font-semibold text-gray-800">Filters</p>
        <div className="flex items-center justify-between gap-2 ">
          {filterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {filterCount}
            </span>
          )}
          {filterCount > 0 && (
            <button
              onClick={handleClearAllFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
              aria-label="Clear all filters"
            >
              <TrashIcon className="h-5 w-5 cursor-pointer" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      <div className="p-4 space-y-6">
        {/* Colors Filter */}
        {data && data.filters?.colors && data.filters.colors.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Color</h3>
            <div className="space-y-2">
              {data.filters.colors.map((color, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <Checkbox
                    className="cursor-pointer"
                    checked={selectedColors?.includes(color)}
                    onCheckedChange={(checked) =>
                      onFilterChange("color", color, checked === true)
                    }
                  />
                  <span className="text-sm text-gray-700">{color}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Sizes Filter */}
        {data && data.filters?.sizes && data.filters.sizes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Size</h3>
            <div className="space-y-2">
              {data.filters.sizes.map((size, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <Checkbox
                    className="cursor-pointer"
                    checked={selectedSizes?.includes(size)}
                    onCheckedChange={(checked) =>
                      onFilterChange("size", size, checked === true)
                    }
                  />
                  <span className="text-sm text-gray-700">{size}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <div>
            <Label htmlFor="minPrice">Min Price</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onPriceChange(e.target.value, maxPrice)}
            />
          </div>
          <div>
            <Label htmlFor="maxPrice">Max Price</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onPriceChange(minPrice, e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
