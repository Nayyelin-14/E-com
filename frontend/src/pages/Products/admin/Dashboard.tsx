import RecentProducts from "@/components/admin/RecentProducts";
import ProductChart from "@/components/Charts/ProductChart";
import ProductMetaCard from "@/components/Products/ProductMetaCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types/index.types";
import { useGetAllProductsWithFiltersQuery } from "@/store/slices/productsApiSlice";
import {
  AlertCircle,
  CheckCircle,
  Package,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import RecentOrders from "@/components/admin/RecentOrders";
import { fakeOrders } from "@/constants/sampleOrder";

const Dashboard = () => {
  const { data, isLoading, error, refetch } = useGetAllProductsWithFiltersQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Calculate stats
  const totalProducts = data?.count || 0;
  const inStockCount =
    data?.products?.reduce(
      (sum: number, p: Product) => sum + Number(p.instock_count || 0),
      0
    ) || 0;

  const newArrivalCount =
    data?.products?.filter((p: Product) => p.is_newArrival).length || 0;

  const featuredCount =
    data?.products?.filter((p: Product) => p.is_Featured).length || 0;

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold">Product Management</h1>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Products</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-sm">
              {error && "data" in error
                ? (error.data as { message?: string })?.message ||
                  "Failed to load products. Please try again."
                : "An unexpected error occurred."}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6  ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">Product Management</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <Skeleton className="h-6 sm:h-8 w-24 sm:w-32" />
                <Skeleton className="h-6 sm:h-8 w-6 sm:w-8 rounded" />
              </div>
              <Skeleton className="h-3 sm:h-4 w-32 sm:w-40 mb-3 sm:mb-4" />
              <Skeleton className="h-10 sm:h-12 w-20 sm:w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <ProductMetaCard
            title="Total Products"
            value={totalProducts}
            description="All products in inventory"
            icon={Package}
            colorScheme="blue"
          />

          <ProductMetaCard
            title="In Stock"
            value={inStockCount}
            description="Available for purchase"
            icon={CheckCircle}
            colorScheme="green"
          />

          <ProductMetaCard
            title="New Arrivals"
            value={newArrivalCount}
            description="Recently added products"
            icon={Sparkles}
            colorScheme="purple"
          />

          <ProductMetaCard
            title="Featured"
            value={featuredCount}
            description="Highlighted products"
            icon={Sparkles}
            colorScheme="yellow"
          />
        </div>
      )}

      <div>
        <ProductChart data={data?.products} isLoading={isLoading} />
      </div>
      <div className="mt-5 flex gap-3 h-full  justify-between">
        <RecentProducts data={data?.products} />
        <RecentOrders data={fakeOrders} />
      </div>
    </div>
  );
};

export default Dashboard;
