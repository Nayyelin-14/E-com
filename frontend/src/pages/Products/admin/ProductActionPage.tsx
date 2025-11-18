import Loader from "@/common/Loader";
import ProductForm from "@/components/admin/ProductForm";
import { productSchema } from "@/schemas/ProductSchema";
import {
  useCreateProductMutation,
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "@/store/slices/productsApiSlice";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import * as z from "zod";
const ProductActionPage = () => {
  const { productId } = useParams();

  const mode = productId ? "edit" : "create";
  const {
    data: productData,
    isLoading: dataLoading,
    isError,
  } = useGetSingleProductQuery(productId!, {
    skip: !productId,
  });

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
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

    const exisitingImages = values.images.filter(
      (img) => !img.file && img.url && img.public_alt
    );
    const newImages = values.images.filter((img) => img.file);

    formdata.append("existingImages", JSON.stringify(exisitingImages));

    newImages.forEach((img) => {
      if (img.file) formdata.append("productImages", img.file as File);
    });

    try {
      if (mode === "create") {
        const response = await createProduct(formdata).unwrap();
        toast.success(response.message);
      } else {
        const response = await updateProduct({
          productId: productId as string,
          formdata,
        }).unwrap();
        toast.success(response.message);
      }

      navigate("/admin/products");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(error.data.message || "Something went wrong");
    }
  }

  useEffect(() => {
    if (isError) {
      navigate("/admin/products");
    }
  }, [isError, navigate]);

  if (dataLoading) {
    return <Loader />;
  }
  return (
    <div className="mt-3">
      <ProductForm
        onSubmit={onSubmit}
        isLoading={mode === "edit" ? updating : creating}
        initialData={productData?.product}
      />
    </div>
  );
};

export default ProductActionPage;
