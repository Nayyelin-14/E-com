import type { Order } from "@/types/Order.types";

export const fakeOrders: Order[] = [
  {
    id: "ORD-001",
    userId: "user-123",
    customer: "John Smith",
    items: [
      {
        name: "Wireless Bluetooth Headphones",
        productId: "prod-001",
        quantity: 1,
        price: 79.99,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
      },
      {
        name: "Phone Case - Black",
        productId: "prod-002",
        quantity: 2,
        price: 15.99,
        image:
          "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200",
      },
    ],
    bill: 111.97,
    status: "delivered",
    createdAt: "2024-11-15T10:30:00Z",
    updatedAt: "2024-11-18T14:20:00Z",
  },
  {
    id: "ORD-002",
    userId: "user-456",
    customer: "Emily Johnson",
    items: [
      {
        name: "Smart Watch Series 5",
        productId: "prod-003",
        quantity: 1,
        price: 299.99,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
      },
    ],
    bill: 299.99,
    status: "shipped",
    createdAt: "2024-11-16T09:15:00Z",
    updatedAt: "2024-11-19T08:45:00Z",
  },
  {
    id: "ORD-003",
    userId: "user-789",
    customer: "Michael Chen",
    items: [
      {
        name: "Laptop Stand - Aluminum",
        productId: "prod-004",
        quantity: 1,
        price: 45.5,
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200",
      },
      {
        name: "Mechanical Keyboard",
        productId: "prod-005",
        quantity: 1,
        price: 129.99,
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
      },
      {
        name: "Wireless Mouse",
        productId: "prod-006",
        quantity: 1,
        price: 34.99,
        image:
          "https://images.unsplash.com/photo-1527814050087-3793815479db?w=200",
      },
    ],
    bill: 210.48,
    status: "paid",
    createdAt: "2024-11-17T14:22:00Z",
    updatedAt: "2024-11-17T14:22:00Z",
  },
  {
    id: "ORD-004",
    userId: "user-234",
    customer: "Sarah Williams",
    items: [
      {
        name: "Running Shoes - Blue",
        productId: "prod-007",
        quantity: 1,
        price: 89.99,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
      },
    ],
    bill: 89.99,
    status: "pending",
    createdAt: "2024-11-19T11:05:00Z",
    updatedAt: "2024-11-19T11:05:00Z",
  },
  {
    id: "ORD-005",
    userId: "user-567",
    customer: "David Martinez",
    items: [
      {
        name: "Coffee Maker - Stainless Steel",
        productId: "prod-008",
        quantity: 1,
        price: 159.99,
        image:
          "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200",
      },
      {
        name: "Coffee Beans - Premium Blend",
        productId: "prod-009",
        quantity: 3,
        price: 18.99,
        image:
          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200",
      },
    ],
    bill: 216.96,
    status: "delivered",
    createdAt: "2024-11-12T08:30:00Z",
    updatedAt: "2024-11-15T16:00:00Z",
  },
  {
    id: "ORD-006",
    userId: "user-890",
    customer: "Jessica Brown",
    items: [
      {
        name: "Yoga Mat - Purple",
        productId: "prod-010",
        quantity: 1,
        price: 29.99,
        image:
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200",
      },
      {
        name: "Resistance Bands Set",
        productId: "prod-011",
        quantity: 1,
        price: 24.99,
        image:
          "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=200",
      },
      {
        name: "Water Bottle - 1L",
        productId: "prod-012",
        quantity: 2,
        price: 12.99,
        image:
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200",
      },
    ],
    bill: 80.96,
    status: "shipped",
    createdAt: "2024-11-18T13:45:00Z",
    updatedAt: "2024-11-19T10:30:00Z",
  },
  {
    id: "ORD-007",
    userId: "user-345",
    customer: "Robert Taylor",
    items: [
      {
        name: "Gaming Chair - Ergonomic",
        productId: "prod-013",
        quantity: 1,
        price: 249.99,
        image:
          "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=200",
      },
    ],
    bill: 249.99,
    status: "cancelled",
    createdAt: "2024-11-14T16:20:00Z",
    updatedAt: "2024-11-15T09:10:00Z",
  },
];
