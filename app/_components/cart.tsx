import { useContext, useState } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Loader2, ShoppingBag } from "lucide-react";
import { createOrder } from "../_actions/order";
import { OrderStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CartProps {
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (isOpen: boolean) => void;
}

const Cart = ({ setIsOpen }: CartProps) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const router = useRouter();

  const { data } = useSession();

  const { products, subtotalPrice, totalDiscount, totalPrice, clearCart } =
    useContext(CartContext);

  const handleFinishOrderClick = async () => {
    if (!data?.user) return;

    const restaurant = products[0].restaurant;

    try {
      setIsSubmitLoading(true);
      await createOrder({
        subtotalPrice,
        totalDiscount,
        totalPrice,
        deliveryFee: restaurant.deliveryFee,
        deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
        restaurant: {
          connect: { id: restaurant.id },
        },
        status: OrderStatus.CONFIRMED,
        user: {
          connect: { id: data.user.id },
        },
        products: {
          createMany: {
            data: products.map((product) => ({
              quantity: product.quantity,
              productId: product.id,
            })),
          },
        },
      });

      clearCart();
      setIsOpen(false);

      toast("Pedido foi criado com sucesso", {
        description: `Data do pedido ${new Date().toLocaleString()}`,
        action: {
          label: "Meus pedidos",
          onClick: () => router.push(`/my-orders`),
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitLoading(false);
    }
  };
  return (
    <>
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
            <Button
              className="mt-6 w-full"
              disabled={isSubmitLoading}
              onClick={() => setIsConfirmDialogOpen(true)}
            >
              Finalizar pedido
            </Button>
          </>
        ) : (
          <div className="flex h-full items-center justify-center gap-4 text-center align-middle text-sm text-muted-foreground">
            <ShoppingBag />
            <p>Adicione itens à sua sacola.</p>
          </div>
        )}
      </div>

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja finalizar seu pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao finalizar seu pedido, você concordar com os termos e condições
              de nossa plataforma
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitLoading}
              onClick={handleFinishOrderClick}
            >
              {isSubmitLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Cart;
