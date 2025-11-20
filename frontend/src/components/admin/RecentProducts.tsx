import type { Product } from "@/types/index.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";

interface RecentProps {
  data: Product[];
}

const RecentProducts = ({ data = [] }: RecentProps) => {
  const recentProducts = [...data]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (!data) {
    return;
  }

  return (
    <div className="flex-1">
      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
          <CardDescription>Latest 5 products added</CardDescription>
        </CardHeader>
        <CardContent>
          {recentProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No products found. Add your first product to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProducts.map((p) => (
                <div
                  key={p._id}
                  className="flex items-start justify-between gap-4 pb-4 last:pb-0 border-b last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {p.category}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentProducts;
