import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";
import { redirect } from "next/navigation";
import Header from "../_components/header";
import OrderItem from "./_components/order-item";

const MyOrdersPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return redirect("/");
  }

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { products: { include: { product: true } }, restaurant: true },
  });

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h2 className="pb-6 text-lg font-semibold">Meus pedidos</h2>
      </div>

      <div className="space-y-4 px-5">
        {orders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </>
  );
};

export default MyOrdersPage;
