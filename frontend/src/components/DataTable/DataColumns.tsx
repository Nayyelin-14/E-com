import type { Product } from "@/index.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useDeleteProductMutation } from "@/store/slices/productsApiSlice";
import { toast } from "sonner";
const DataColumns = (): ColumnDef<Product>[] => {
  const navigate = useNavigate();
  const [deleteAction] = useDeleteProductMutation();
  const deletehandler = async (productId: string) => {
    try {
      const response = await deleteAction(productId);
      if (response.isSuccess) {
        toast.success(response?.message);
      }
      console.log(response);
    } catch (error: any) {
      console.log(error);
      toast.error(error.data.message);
    }
  };
  return [
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ row }) => {
        const product = row.original;
        const images = product?.images.slice(0, 3) || [];

        return (
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
            {images.map((img) => (
              <Avatar>
                <AvatarImage src={img?.url} />
                <AvatarFallback>
                  {product.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => {
        const product = row.original;

        return <div className="font-medium">{product?.name}</div>;
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="font-medium">
            <Badge className="capitalize " variant={"secondary"}>
              {product?.category}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const product = row.original;

        return <div className="font-medium">{product?.price.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "instock_count",
      header: "Stock",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="font-medium">
            <Badge
              variant={
                product?.instock_count > 10
                  ? "default"
                  : product?.instock_count > 0
                  ? "secondary"
                  : "destructive"
              }
            >
              {product?.instock_count}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="font-medium">
            {new Date(product.createdAt).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <Eye className="mr-1 w-4 h-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/admin/products/actions/${product._id}`)
                }
              >
                <Edit className="mr-1 w-4 h-4 text-blue-500" /> Edit product
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <AlertDialog>
                  <AlertDialogTrigger className="flex gap-2 text-sm px-2 py-1  items-center hover:bg-gray-100 rounded-md">
                    <Trash className="mr-1 w-4 h-4 text-red-500 " /> Delete
                    product
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deletehandler(product._id)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export default DataColumns;
