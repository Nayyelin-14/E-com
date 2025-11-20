import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/store/slices/Cart";
import { Minus, Plus, TrashIcon } from "lucide-react";
import { useDispatch } from "react-redux";

type ItemProps = {
  name: string;
  image: string;
  size: string;
  price: number;
  color: string[];
  quantity: number;
  productKey: string;
};
const CartItem = ({
  name,
  image,
  color,
  price,
  size,
  quantity,
  productKey,
}: ItemProps) => {
  const dispatch = useDispatch();

  return (
    <div className="border border-gray-200 shadow-lg mb-5 h-32 rounded-xl flex justify-between relative">
      <div className="flex items-center gap-3 p-2">
        <img src={image} alt="" className="w-20 h-26 object-cover rounded-lg" />
        <div className="flex flex-col justify-center">
          <p className=" font-medium">{name}</p>
          <p className="text-sm font-medium text-gray-400">{color}</p>
          <p className="text-sm font-medium text-gray-400">$ {price}</p>
          <p className="text-md font-bold "> size - {size}</p>
        </div>
      </div>
      <div className="flex flex-col justify-between h-full mr-5 py-3 items-end">
        <TrashIcon
          className="w-5 h-5 text-red-500 hover:text-red-300 cursor-pointer"
          onClick={() => dispatch(removeFromCart(productKey))}
        />
        <div className="flex gap-2 items-center">
          <button
            className="w-6 h-6 flex justify-center items-center border border-gray-200 bg-black text-white cursor-pointer rounded hover:bg-black/60"
            onClick={() => dispatch(decreaseQuantity(productKey))}
          >
            <Minus size={12} />
          </button>
          <span>{quantity}</span>
          <button
            className="w-6 h-6 flex justify-center items-center border border-gray-200 bg-black text-white rounded hover:bg-black/60 cursor-pointer"
            onClick={() => dispatch(increaseQuantity(productKey))}
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
