import ProductMetaCard from "@/components/Products/ProductMetaCard";
import type { Product } from "@/types/index.types";
import { useGetAllProductsWithFiltersQuery } from "@/store/slices/productsApiSlice";
import {
  Package,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable from "@/components/DataTable/DataTable";

const ProductManagementPage = () => {
  const { data, isLoading, error, isFetching, refetch } =
    useGetAllProductsWithFiltersQuery(
      {},
      {
        refetchOnMountOrArgChange: true,
      }
    );

  // Calculate stats
  const totalProducts = data?.count || 0;
  const inStockCount =
    data?.products?.filter((p: Product) => p.instock_count > 0).length || 0;
  const outOfStockCount =
    data?.products?.filter((p: Product) => p.instock_count === 0).length || 0;

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Product Management</h1>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Products</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              {error && "data" in error
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (error.data as any)?.message ||
                  "Failed to load products. Please try again."
                : "An unexpected error occurred."}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-4"
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
    <div className="container mx-auto ">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your product inventory and stock levels
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
              <Skeleton className="h-4 w-40 mb-4" />
              <Skeleton className="h-12 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            title="Out of Stock"
            value={outOfStockCount}
            description="Needs restocking"
            icon={XCircle}
            colorScheme="red"
          />
        </div>
      )}

      {/* Loading overlay for refetch */}
      {isFetching && !isLoading && (
        <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Updating data...
        </div>
      )}
      <div className="my-10">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className={`text-md lg:text-xl xk:text-2xl font-bold`}>
                Data Management
              </CardTitle>
            </div>
            <CardDescription>Manage all the products inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={data?.products} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductManagementPage;
