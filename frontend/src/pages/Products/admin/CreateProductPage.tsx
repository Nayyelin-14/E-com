import ProductForm from "@/components/admin/ProductForm";
import { productSchema } from "@/schemas/ProductSchema";
import { useCreateProductMutation } from "@/store/slices/productsApiSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as z from "zod";
const CreateProductPage = () => {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const navigate = useNavigate();
  async function onSubmit(values: z.infer<typeof productSchema>) {
    const formdata = new FormData();
    formdata.append("name", values?.name);
    formdata.append("category", values?.category);
    formdata.append("description", values?.description);
    formdata.append("price", String(values?.price));
    formdata.append("instock_count", String(values?.instock_count));
    formdata.append("is_Featured", String(values?.is_Featured));
    formdata.append("is_newArrival", String(values?.is_newArrival));
    formdata.append("rating_count", String(values?.rating_count));

    values?.colors?.forEach((c) => formdata.append("colors", c));
    values?.sizes?.forEach((s) => formdata.append("sizes", s));

    values?.images?.forEach((img) => {
      if (img.file) {
        formdata.append("productImages", img.file as File);
      }
    });
    try {
      const response = await createProduct(formdata).unwrap();
      console.log(response);
      if (response.isSuccess!) {
        toast.success(response.message!);
        navigate("/admin/products");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(error.data.message || error.data.error[0].msg);
    }
  }
  return (
    <div className="mt-3">
      <ProductForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreateProductPage;
