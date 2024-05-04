import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";
import Header from "../_components/header";
import RestaurantItem from "../_components/restaurant-item";
import { notFound } from "next/navigation";
import { FrownIcon } from "lucide-react";

const MyFavoriteRestaurants = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return notFound();
  }
  const userFavoriteRestaurants = await db.userFavoriteRestaurant.findMany({
    where: { userId: session?.user.id },
    include: { restaurant: true },
  });
  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">Restaurantes Favoritos</h2>
        <div className="flex w-full flex-col gap-6">
          {userFavoriteRestaurants.length > 0 ? (
            userFavoriteRestaurants.map(({ restaurant }) => (
              <RestaurantItem
                key={restaurant.id}
                restaurant={restaurant}
                userFavoriteRestaurants={userFavoriteRestaurants}
                className="min-w-full max-w-full"
              />
            ))
          ) : (
            <div className="font-md mt-6 flex items-center justify-center gap-2 text-muted-foreground">
              Você ainda não marcou nenhum restaurante como favorito
              <FrownIcon />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyFavoriteRestaurants;
