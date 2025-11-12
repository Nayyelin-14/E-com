import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { productSchema } from "@/schemas/ProductSchema";
import ImagesInput from "../Inputs/ImagesInput";
import CategoryDropDown from "../Inputs/CategoryDropDown";
import ColorPicker from "../Inputs/ColorPicker";
import SizePicker from "../Inputs/SizePicker";
import { Switch } from "../ui/switch";

interface FormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  onSubmit: (data: typeof productSchema) => void;
  isLoading: boolean;
}
const ProductForm = ({ initialData, onSubmit, isLoading }: FormProps) => {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      category: "",
      rating_count: 0,
      sizes: [],
      colors: [],
      images: [],
      instock_count: 0,
      is_Featured: false,
      is_newArrival: false,
    },
  });

  //   // 2. Define a submit handler.
  //   function onSubmit(values: z.infer<typeof productSchema>) {
  //     // Do something with the form values.
  //     // ✅ This will be type-safe and validated.
  //     console.log(values);
  //   }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instock_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instock Count </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategoryDropDown
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>
                  <FormControl>
                    <SizePicker sizes={field.value} onChange={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <ImagesInput images={field.value} onChange={field.onChange} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="colors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Colors</FormLabel>
                <FormControl>
                  <ColorPicker colors={field.value} onChange={field.onChange} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-30">
            <FormField
              control={form.control}
              name="is_Featured"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_newArrival"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Arrival</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating new product" : "Create new product"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
