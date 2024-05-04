/* eslint-disable no-unused-vars */
"use client";

import { Prisma } from "@prisma/client";
import { createContext, useState } from "react";
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
    emptyCard,
  }: {
    product: CartProduct;
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

  const subtotalPrice = products.reduce((acc, product) => {
    return acc + Number(product.price) * product.quantity;
  }, 0);

  const totalPrice =
    products.reduce((acc, product) => {
      return (
        acc + Number(calculateProductTotalPrice(product)) * product.quantity
      );
    }, 0) + Number(products?.[0]?.restaurant?.deliveryFee);

  const totalDiscount =
    totalPrice - subtotalPrice - Number(products?.[0]?.restaurant?.deliveryFee);

  const clearCart = () => {
    return setProducts([]);
  };

  const totalQuantity = products.reduce((acc, product) => {
    return acc + product.quantity;
  }, 0);

  const decreaseProductQuantity: ICartContext["decreaseProductQuantity"] = (
    productId: string,
  ) => {
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

  const increaseProductQuantity: ICartContext["increaseProductQuantity"] = (
    productId: string,
  ) => {
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

  const removeProductFromCart: ICartContext["removeProductFromCart"] = (
    productId: string,
  ) => {
    return setProducts((prev) =>
      prev.filter((product) => product.id !== productId),
    );
  };

  const addProductToCart: ICartContext["addProductToCart"] = ({
    product,
    emptyCard,
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
              quantity: cartProduct.quantity + product.quantity,
            };
          }

          return cartProduct;
        });
      });
    }

    setProducts((prev) => [...prev, product]);
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
