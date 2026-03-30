"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  imageUrl?: string;
  designUrl?: string;
  isCustom?: boolean;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string; size: string; color: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; size: string; color: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = `${action.payload.id}-${action.payload.size}-${action.payload.color}`;
      const existingIdx = state.items.findIndex(
        (i) => `${i.id}-${i.size}-${i.color}` === key
      );
      if (existingIdx >= 0) {
        const updated = [...state.items];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + action.payload.quantity,
        };
        return { ...state, items: updated, isOpen: true };
      }
      return { ...state, items: [...state.items, action.payload], isOpen: true };
    }
    case "REMOVE_ITEM": {
      const key = `${action.payload.id}-${action.payload.size}-${action.payload.color}`;
      return { ...state, items: state.items.filter((i) => `${i.id}-${i.size}-${i.color}` !== key) };
    }
    case "UPDATE_QUANTITY": {
      const key = `${action.payload.id}-${action.payload.size}-${action.payload.color}`;
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => `${i.id}-${i.size}-${i.color}` !== key) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          `${i.id}-${i.size}-${i.color}` === key ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  const addItem = useCallback((item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item }), []);
  const removeItem = useCallback((id: string, size: string, color: string) => dispatch({ type: "REMOVE_ITEM", payload: { id, size, color } }), []);
  const updateQuantity = useCallback((id: string, size: string, color: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, size, color, quantity } }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);
  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, toggleCart, openCart, closeCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
