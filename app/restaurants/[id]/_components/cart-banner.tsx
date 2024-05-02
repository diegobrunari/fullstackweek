"use client";

import { CartContext } from "@/app/_context/cart";
import { Restaurant } from "@prisma/client";
import { useContext } from "react";
import { formatCurrency } from "@/app/_helpers/price";
import { Button } from "@/app/_components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import Cart from "@/app/_components/cart";

interface CartBannerProps {
  restaurant: Pick<Restaurant, "id">;
}

const CartBanner = ({ restaurant }: CartBannerProps) => {
  const { products, totalPrice, totalQuantity } = useContext(CartContext);

  const restaurantHasProductsOnCart = products.some(
    (product) => product.restaurantId === restaurant.id,
  );

  if (!restaurantHasProductsOnCart) return null;
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full rounded-t-3xl border-t border-solid border-muted-foreground/20 bg-white p-5 pt-3 shadow-md">
      <div className="flex items-center justify-between">
        {/* preco */}
        <div>
          <span className="text-xs font-normal text-muted-foreground">
            Total sem entrega
          </span>
          <h3 className="font-semibold">
            {formatCurrency(totalPrice)}{" "}
            <span className="text-xs text-muted-foreground">
              {" "}
              / {totalQuantity}
            </span>
          </h3>
        </div>

        <Sheet>
          <SheetTrigger>
            <Button>Ver sacola</Button>
          </SheetTrigger>
          <SheetContent className="w-[90vw]">
            <SheetHeader>
              <SheetTitle className="text-left">Sacola</SheetTitle>
            </SheetHeader>
            <Cart />
          </SheetContent>
        </Sheet>

        {/* botao */}
      </div>
    </div>
  );
};

export default CartBanner;
