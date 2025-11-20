import { createSlice } from "@reduxjs/toolkit";

export interface CartItem {
  key?: string;
  productId: string;
  price: string;
  quantity: number;
  name: string;
  color: string;
  size: string;
  image: string;
}

interface CartState {
  items: CartItem[];
}

const initialCartState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    addToCart(state, action) {
      const { productId, price, quantity, name, color, size, image } =
        action.payload;
      const key = `${productId}_${size}_${color}`;
      const existedItem = state.items.find((c) => c.key === key);
      if (existedItem) {
        existedItem.quantity += quantity;
      } else {
        state.items.push({
          key,
          productId,
          price,
          quantity,
          name,
          color,
          size,
          image,
        });
      }
    },
    increaseQuantity(state, action) {
      const existedItem = state.items.find(
        (item) => item.key === action.payload
      );
      if (existedItem) {
        existedItem.quantity += 1;
      }
    },
    decreaseQuantity(state, action) {
      const existedItem = state.items.find(
        (item) => item.key === action.payload
      );
      if (existedItem && existedItem?.quantity > 0) {
        existedItem.quantity -= 1;
      }
      if (existedItem && existedItem?.quantity === 0) {
        state.items = state.items.filter((item) => item.key !== action.payload);
      }
    },
    removeFromCart(state, action) {
      const existedItem = state.items.find(
        (item) => item.key === action.payload
      );
      if (existedItem) {
        state.items = state.items.filter((item) => item.key !== action.payload);
      }
    },
  },
});

export const { addToCart, removeFromCart, decreaseQuantity, increaseQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
