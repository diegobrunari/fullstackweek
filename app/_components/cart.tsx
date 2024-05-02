import { useContext } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";

const Cart = () => {
  const { products, subtotalPrice, totalDiscount, totalPrice } =
    useContext(CartContext);
  return (
    <div className="flex h-full flex-col py-5">
      <div className="flex-auto space-y-4">
        {products.map((product) => (
          <CartItem cartProduct={product} key={product.id} />
        ))}
      </div>

      {products.length > 0 ? (
        <>
          <div className="mt-6">
            <Card>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between text-xs">
                  <p className="text-muted-foreground">Subtotal</p>
                  <span>{formatCurrency(subtotalPrice)}</span>
                </div>
                <Separator />

                <div className="flex items-center justify-between text-xs">
                  <p className="text-muted-foreground">Descontos</p>
                  <span>{formatCurrency(totalDiscount)}</span>
                </div>
                <Separator />

                <div className="flex items-center justify-between text-xs">
                  <p className="text-muted-foreground">Entrega</p>
                  {Number(products?.[0].restaurant.deliveryFee) === 0 ? (
                    <span className="uppercase text-primary">Grátis</span>
                  ) : (
                    formatCurrency(Number(products[0].restaurant.deliveryFee))
                  )}
                </div>
                <Separator />

                <div className="text-semibold flex items-center justify-between text-xs">
                  <p className="text-muted-foreground">Total</p>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <Button className="mt-6 w-full">Finalizar pedido</Button>
        </>
      ) : (
        <div className="flex h-full items-center justify-center gap-4 text-center align-middle text-sm text-muted-foreground">
          <ShoppingBag />
          <p>Adicione itens à sua sacola.</p>
        </div>
      )}
    </div>
  );
};

export default Cart;
