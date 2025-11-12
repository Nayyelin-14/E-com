export type ProductType = {
  id: number;
  name: string;
  images: { url: string }[];
  size: string[];
  rating: number;
  category: string;
  price: number;
  color: string[];
  description: string;
};

export const products: ProductType[] = [
  {
    id: 1,
    name: "Black T-shirt",
    price: 200,
    category: "Tshirt",
    color: ["#000000", "#FF0000"],
    size: ["S", "M", "L"],
    description: "Soft and stylish T-shirt perfect for casual everyday wear.",
    rating: 1.5,
    images: [
      { url: "https://picsum.photos/500/500?random=1" },
      {
        url: "https://cdn.shopify.com/s/files/1/2987/0758/files/Pique_T-Shirt-T-Shirt-LDM101007-0101-Black-3.jpg",
      },
      { url: "https://media.rs-online.com/Y2535523-01.jpg" },
      {
        url: "https://www.gmm-tv.com/shop/image/cache/catalog/product/8-shirt/A019-polcasan-official-t-shirt-th/BOAM-SHRT-000C_soldout-540x540.jpg",
      },
    ],
  },
  {
    id: 2,
    name: "Blue Jeans",
    price: 500,
    category: "Jeans",
    color: ["#000000", "#1E90FF"],
    size: ["M", "L", "XL"],
    description: "Classic blue jeans designed for comfort and durability.",
    rating: 4,
    images: [
      { url: "https://picsum.photos/500/500?random=3" },
      { url: "https://picsum.photos/500/500?random=4" },
    ],
  },
  {
    id: 3,
    name: "White Top",
    price: 300,
    category: "Top",
    color: ["#FFFFFF", "#FF6347"],
    size: ["S", "M"],
    rating: 5,
    description:
      "Lightweight white top ideal for both casual and dressy looks.",
    images: [
      { url: "https://picsum.photos/500/500?random=5" },
      { url: "https://picsum.photos/500/500?random=6" },
    ],
  },
  {
    id: 4,
    name: "Brown Leather Jacket",
    price: 900,
    category: "Jacket",
    color: ["#8B4513", "#000000"],
    size: ["M", "L"],
    rating: 4,
    description:
      "Premium leather jacket offering a timeless style with a cozy inner lining.",
    images: [
      { url: "https://picsum.photos/500/500?random=7" },
      { url: "https://picsum.photos/500/500?random=8" },
    ],
  },
  {
    id: 5,
    name: "Gray Casual Shirt",
    price: 400,
    category: "Shirts",
    color: ["#808080", "#000000"],
    size: ["S", "M", "L", "XL"],
    rating: 3,
    description:
      "Breathable and comfortable gray shirt made for daily wear and workdays.",
    images: [
      { url: "https://picsum.photos/500/500?random=9" },
      { url: "https://picsum.photos/500/500?random=10" },
    ],
  },
  {
    id: 6,
    name: "Green Polo Shirt",
    price: 450,
    category: "Shirts",
    color: ["#008000", "#FFFFFF"],
    size: ["M", "L", "XL"],
    rating: 4,
    description:
      "Classic polo shirt made from soft cotton for everyday comfort.",
    images: [
      { url: "https://picsum.photos/500/500?random=11" },
      { url: "https://picsum.photos/500/500?random=12" },
    ],
  },
  {
    id: 7,
    name: "Navy Hoodie",
    price: 650,
    category: "Hoodies",
    color: ["#000080", "#808080"],
    size: ["S", "M", "L", "XL"],
    rating: 5,
    description:
      "Warm and cozy fleece hoodie with adjustable drawstrings and front pocket.",
    images: [
      { url: "https://picsum.photos/500/500?random=13" },
      { url: "https://picsum.photos/500/500?random=14" },
    ],
  },
  {
    id: 8,
    name: "Red Sweatshirt",
    price: 550,
    category: "Sweatshirts",
    color: ["#FF0000", "#000000"],
    size: ["M", "L", "XL"],
    rating: 4,
    description: "Soft and durable sweatshirt with a modern, relaxed fit.",
    images: [
      { url: "https://picsum.photos/500/500?random=15" },
      { url: "https://picsum.photos/500/500?random=16" },
    ],
  },
  {
    id: 9,
    name: "Beige Shorts",
    price: 350,
    category: "Shorts",
    color: ["#F5F5DC", "#A52A2A"],
    size: ["S", "M", "L"],
    rating: 3,
    description:
      "Light and breathable shorts designed for maximum comfort in hot weather.",
    images: [
      { url: "https://picsum.photos/500/500?random=17" },
      { url: "https://picsum.photos/500/500?random=18" },
    ],
  },
];

export const SIZES = ["xs", "sm", "lg", "xl", "xxl"];
