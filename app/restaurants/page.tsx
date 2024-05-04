import { Suspense } from "react";
import Restaurants from "./_components/restaurants";
import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";

const RestaurantsPage = async () => {
  const session = await getServerSession(authOptions);
  const userFavoriteRestaurant = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      restaurant: true,
    },
  });
  return (
    <Suspense>
      <Restaurants userFavoriteRestaurants={userFavoriteRestaurant} />
    </Suspense>
  );
};

export default RestaurantsPage;
