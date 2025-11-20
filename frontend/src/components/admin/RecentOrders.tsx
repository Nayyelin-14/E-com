import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { Order } from "@/types/Order.types";

interface RecentProps {
  data: Order[];
}

// const getStatusVariant = (status: Order["status"]) => {
//   switch (status) {
//     case "delivered":
//       return "default"; // Green
//     case "shipped":
//       return "secondary"; // Blue
//     case "paid":
//       return "outline"; // Gray
//     case "pending":
//       return "secondary"; // Yellow-ish
//     case "cancelled":
//       return "destructive"; // Red
//     default:
//       return "outline";
//   }
// };

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "shipped":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "paid":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

const RecentOrders = ({ data = [] }: RecentProps) => {
  const recentOrders = [...data]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="flex-1">
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest 5 orders placed</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No orders found. Your first order will appear here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className=" font-medium">
                      ${order.bill.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentOrders;
