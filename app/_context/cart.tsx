/* eslint-disable no-unused-vars */
"use client";

import { Prisma, Product } from "@prisma/client";
import { createContext, useMemo, useState } from "react";
import { calculateProductTotalPrice } from "../_helpers/price";

export interface CartProduct
  extends Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          id: true;
          deliveryTimeMinutes: true;
          deliveryFee: true;
        };
      };
    };
  }> {
  quantity: number;
}
interface ICartContext {
  products: CartProduct[];
  totalPrice: number;
  subtotalPrice: number;
  totalDiscount: number;
  totalQuantity: number;
  addProductToCart: ({
    product,
    quantity,
    emptyCard,
  }: {
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: {
            id: true;
            deliveryTimeMinutes: true;
            deliveryFee: true;
          };
        };
      };
    }>;
    quantity: number;
    emptyCard?: boolean;
  }) => void;
  decreaseProductQuantity: (productId: string) => void;
  increaseProductQuantity: (productId: string) => void;
  removeProductFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<ICartContext>({
  products: [],
  subtotalPrice: 0,
  totalDiscount: 0,
  totalPrice: 0,
  totalQuantity: 0,
  addProductToCart: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProductFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);

  const subtotalPrice = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + Number(product.price) * product.quantity;
    }, 0);
  }, [products]);

  const totalPrice = useMemo(() => {
    return (
      products.reduce((acc, product) => {
        return (
          acc + Number(calculateProductTotalPrice(product)) * product.quantity
        );
      }, 0) + Number(products?.[0]?.restaurant?.deliveryFee)
    );
  }, [products]);

  const totalDiscount =
    totalPrice - subtotalPrice - Number(products?.[0]?.restaurant?.deliveryFee);

  const clearCart = () => {
    return setProducts([]);
  };

  const totalQuantity = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + product.quantity;
    }, 0);
  }, [products]);

  const decreaseProductQuantity = (productId: string) => {
    return setProducts((prev) => {
      return prev.map((cartProduct) => {
        if (cartProduct.id === productId) {
          if (cartProduct.quantity === 1) {
            return cartProduct;
          }
          return {
            ...cartProduct,
            quantity: cartProduct.quantity - 1,
          };
        }

        return cartProduct;
      });
    });
  };

  const increaseProductQuantity = (productId: string) => {
    return setProducts((prev) => {
      return prev.map((cartProduct) => {
        if (cartProduct.id === productId) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + 1,
          };
        }

        return cartProduct;
      });
    });
  };

  const removeProductFromCart = (productId: string) => {
    return setProducts((prev) =>
      prev.filter((product) => product.id !== productId),
    );
  };

  const addProductToCart = ({
    product,
    quantity,
    emptyCard,
  }: {
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: {
            deliveryFee: true;
          };
        };
      };
    }>;
    quantity: number;
    emptyCard?: boolean;
  }) => {
    if (emptyCard) {
      setProducts([]);
    }

    const isPorductAlreadyOnCart = products.some(
      (cartProduct) => cartProduct.id === product.id,
    );

    if (isPorductAlreadyOnCart) {
      return setProducts((prev) => {
        return prev.map((cartProduct) => {
          if (cartProduct.id === product.id) {
            return {
              ...cartProduct,
              quantity: cartProduct.quantity + quantity,
            };
          }

          return cartProduct;
        });
      });
    }

    setProducts((prev) => [...prev, { ...product, quantity: quantity }]);
  };

  return (
    <CartContext.Provider
      value={{
        subtotalPrice,
        totalQuantity,
        totalDiscount,
        totalPrice,
        products,
        addProductToCart,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProductFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};