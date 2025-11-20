import { X } from "lucide-react";
import CartItem from "./CartItem";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

interface SliderProps {
  isCartOpen: boolean;
  setCartOpen: (value: boolean) => void;
}

const CartSlider = ({ isCartOpen, setCartOpen }: SliderProps) => {
  const products = useSelector((state: RootState) => state.cart.items);

  return (
    <>
      {/* Backdrop/Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Slider */}
      <div
        className={`bg-white text-black w-full sm:w-96 md:w-[28rem] h-full fixed top-0 right-0 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <p className="text-xl font-medium">Cart Items</p>
            <X
              onClick={() => setCartOpen(false)}
              className="text-black cursor-pointer hover:bg-gray-100 rounded-full p-1"
              size={24}
            />
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {products && products.length > 0 ? (
              products.map((p, index) => (
                <CartItem
                  key={p.key || index}
                  name={p.name}
                  size={p.size[0]}
                  color={Array.isArray(p.color) ? p.color : [p.color]}
                  price={Number(p.price)}
                  image={p.image}
                  quantity={p.quantity}
                  productKey={p.key!}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-center">Your cart is empty</p>
              </div>
            )}
          </div>

          {/* Footer with Checkout button */}
          <div className="p-4 border-t bg-white">
            <button className="bg-black text-white p-3 rounded-xl w-full hover:bg-gray-800 transition-colors">
              Go to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSlider;
