import { UserFavoriteRestaurant } from "@prisma/client";

export const isRestaurantFav = (
  restaurantId: string,
  userFavoriteRestaurants: UserFavoriteRestaurant[],
) => userFavoriteRestaurants?.some((fav) => fav.restaurantId === restaurantId);
