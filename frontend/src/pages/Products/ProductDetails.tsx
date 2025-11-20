import { useEffect, useState } from "react";

import ProductRating from "../../components/Products/ProductRating";
import { Loader, Minus, Plus } from "lucide-react";
import { useGetSingleProductQuery } from "@/store/slices/productsApiSlice";
import { useParams } from "react-router";
import type { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/Cart";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number | null>(1);
  const { id } = useParams();
  const { data, isLoading: dataLoading } = useGetSingleProductQuery(id!);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (data?.product) {
      // Set defaults only if not already set
      if (data.product.images?.length > 0) {
        setSelectedImage(data.product.images[0].url);
      }
      if (data.product.colors?.length > 0) {
        setSelectedColor(data.product.colors[0]);
      }
      if (data.product.sizes?.length > 0) {
        setSelectedSize(data.product.sizes[0]);
      }
    }
  }, [data?.product, id]); // ONLY depend on id - this runs when navigating to a new product
  const addToCartHandler = () => {
    dispatch(
      addToCart({
        productId: id,
        price: data.product.price,
        name: data.product.name,
        size: selectedSize,
        color: selectedColor,
        image: data.product.images[0].url,
        quantity,
      })
    );
  };
  if (dataLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  if (!data?.product) {
    return <div>Product not found</div>;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-1 flex flex-col gap-3">
          {data.product.images &&
            data.product.images.map(
              (img: { url: string; _id: string }, index: number) => (
                <div
                  key={img._id || index}
                  className={`${
                    selectedImage === img.url && "border-2 border-gray-300"
                  } object-cover w-24 h-24 p-1 rounded-xl`}
                >
                  <img
                    onClick={() => setSelectedImage(img.url)}
                    src={img.url}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </div>
              )
            )}
        </div>
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected product"
            className="col-span-3 h-full aspect-square rounded-xl object-cover"
          />
        )}
      </div>
      <div className="flex flex-col justify-between">
        <p className="text-3xl font-bold">{data.product.name}</p>
        <ProductRating ratingCount={data.product.rating} />
        <p className="text-3xl font-extrabold mb-1">$ {data.product.price}</p>
        <div
          className="text-sm font-medium text-gray-400"
          dangerouslySetInnerHTML={{ __html: data.product.description }}
        />
        <hr className="text-xl font-bold my-2 text-gray-400" />
        <p className="text-xl font-bold">Colors</p>
        <div className="flex gap-2 mt-2 items-center">
          {data.product.colors?.map((c: string, index: number) => (
            <div
              key={index}
              className={`rounded-full w-6 h-6 p-0.5 cursor-pointer hover:scale-110 transition-transform ${
                selectedColor === c && "ring-2 ring-gray-400 ring-offset-2"
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setSelectedColor(c)}
            />
          ))}
        </div>
        <hr className="text-xl font-bold my-2 text-gray-400" />
        <p className="text-xl font-bold">Sizes</p>

        <div className="flex gap-2 mt-2 items-center">
          {data.product.sizes?.map((s: string, index: number) => (
            <div
              key={index}
              className={`p-2 px-4 rounded-lg text-center cursor-pointer text-sm border transition-colors ${
                selectedSize === s
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setSelectedSize(s)}
            >
              <span>{s}</span>
            </div>
          ))}
        </div>
        {userInfo && (
          <>
            <hr className="text-xl font-bold my-2 text-gray-400" />
            <div className="flex gap-4 items-center">
              <div className="flex gap-3 items-center border border-gray-200 rounded-lg px-4 py-2">
                <button
                  className="w-8 h-8 flex justify-center items-center bg-gray-100 text-black cursor-pointer rounded hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    if (quantity! === 1 || quantity! < 1) {
                      return 1;
                    }
                    setQuantity((prev) => prev! - 1);
                  }}
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold min-w-[20px] text-center">
                  {quantity}
                </span>

                <button
                  className="w-8 h-8 flex justify-center items-center bg-gray-100 text-black rounded hover:bg-gray-200 cursor-pointer transition-colors"
                  onClick={() => setQuantity((prev) => prev! + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                className="p-3 rounded-lg bg-black w-full text-center font-semibold text-white hover:bg-black/80 cursor-pointer transition-colors"
                onClick={addToCartHandler}
              >
                Add to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductDetails;
