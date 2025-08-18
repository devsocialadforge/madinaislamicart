"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string; // product _id or slug
  name: string;
  price: number;
  qty: number;
  image?: string;
  variant?: string; // size/color etc.
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string, variant?: string) => void;
  setQty: (id: string, qty: number, variant?: string) => void;
  clear: () => void;
  totalCount: number;
  totalPrice: number;
};

function keyOf(id: string, variant?: string) {
  return `${id}__${variant ?? ""}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const map = new Map(
            state.items.map((i) => [keyOf(i.id, i.variant), i])
          );
          const k = keyOf(item.id, item.variant);
          const ex = map.get(k);
          if (ex) map.set(k, { ...ex, qty: ex.qty + item.qty });
          else map.set(k, item);
          const items = Array.from(map.values());
          return {
            items,
            totalCount: items.reduce((n, i) => n + i.qty, 0),
            totalPrice: items.reduce((s, i) => s + i.qty * i.price, 0),
          };
        }),
      remove: (id, variant) =>
        set((state) => {
          const items = state.items.filter(
            (i) => !(i.id === id && i.variant === variant)
          );
          return {
            items,
            totalCount: items.reduce((n, i) => n + i.qty, 0),
            totalPrice: items.reduce((s, i) => s + i.qty * i.price, 0),
          };
        }),
      setQty: (id, qty, variant) =>
        set((state) => {
          const items = state.items.map((i) =>
            i.id === id && i.variant === variant
              ? { ...i, qty: Math.max(1, qty) }
              : i
          );
          return {
            items,
            totalCount: items.reduce((n, i) => n + i.qty, 0),
            totalPrice: items.reduce((s, i) => s + i.qty * i.price, 0),
          };
        }),
      clear: () => set({ items: [], totalCount: 0, totalPrice: 0 }),
      totalCount: 0,
      totalPrice: 0,
    }),
    {
      name: "cart_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        items: s.items,
        totalCount: s.totalCount,
        totalPrice: s.totalPrice,
      }),
    }
  )
);
