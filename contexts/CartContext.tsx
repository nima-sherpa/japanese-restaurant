'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { CartItem, Cart } from '@/lib/validations/cart'

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { menuItemId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_TYPE'; payload: 'PICKUP' | 'DELIVERY' }
  | { type: 'SET_DELIVERY_ADDRESS'; payload: { address: string; city: string; zip: string } }
  | { type: 'LOAD_FROM_STORAGE'; payload: Cart }

interface CartContextType {
  cart: Cart
  addItem: (item: CartItem) => void
  removeItem: (menuItemId: number) => void
  updateQuantity: (menuItemId: number, quantity: number) => void
  clearCart: () => void
  setOrderType: (type: 'PICKUP' | 'DELIVERY') => void
  setDeliveryAddress: (address: string, city: string, zip: string) => void
  getTotalCents: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'japanese-restaurant-cart'

const initialCart: Cart = {
  items: [],
  type: 'PICKUP',
}

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item.menuItemId === action.payload.menuItemId
      )
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item: any) =>
            item.menuItemId === action.payload.menuItemId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.menuItemId !== action.payload),
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item: any) =>
          item.menuItemId === action.payload.menuItemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }

    case 'CLEAR_CART':
      return initialCart

    case 'SET_TYPE':
      return {
        ...state,
        type: action.payload,
      }

    case 'SET_DELIVERY_ADDRESS':
      return {
        ...state,
        deliveryAddress: action.payload.address,
        deliveryCity: action.payload.city,
        deliveryZip: action.payload.zip,
      }

    case 'LOAD_FROM_STORAGE':
      return action.payload

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed })
      } catch {
        // Invalid data, ignore
      }
    }
  }, [])

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (menuItemId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: menuItemId })
  }

  const updateQuantity = (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { menuItemId, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const setOrderType = (type: 'PICKUP' | 'DELIVERY') => {
    dispatch({ type: 'SET_TYPE', payload: type })
  }

  const setDeliveryAddress = (address: string, city: string, zip: string) => {
    dispatch({
      type: 'SET_DELIVERY_ADDRESS',
      payload: { address, city, zip },
    })
  }

  const getTotalCents = () => {
    return cart.items.reduce(
      (total, item) => total + item.priceCents * item.quantity,
      0
    )
  }

  const getItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0)
  }

  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setOrderType,
    setDeliveryAddress,
    getTotalCents,
    getItemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
