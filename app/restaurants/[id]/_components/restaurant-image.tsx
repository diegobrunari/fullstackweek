"use client";
import { Button } from "@/app/_components/ui/button";
import { isRestaurantFav } from "@/app/_helpers/is-restaurant-fav";
import useToggleFavRestaurant from "@/app/_hooks/use-toggle-fav-restaurant";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { ChevronLeftIcon, HeartIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RestaurantImageProps {
  restaurant: Pick<Restaurant, "id" | "name" | "imageUrl">;
  useFavoriteRestaurants: UserFavoriteRestaurant[];
}

const RestaurantImage = ({
  restaurant,
  useFavoriteRestaurants,
}: RestaurantImageProps) => {
  const { data } = useSession();
  const router = useRouter();

  const isFav = isRestaurantFav(restaurant.id, useFavoriteRestaurants);

  const { handleFavoriteClick } = useToggleFavRestaurant({
    restaurantId: restaurant.id,
    restaurantIsFavorited: isFav,
    userId: data?.user.id,
  });

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="relative h-[250px] w-full">
      <Image
        src={restaurant.imageUrl}
        alt={restaurant.name}
        fill
        className="object-cover"
      />

      <Button
        size="icon"
        onClick={handleBackClick}
        className="absolute left-4 top-4 rounded-full bg-white text-foreground hover:text-white"
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        size="icon"
        className={`absolute right-2 top-2 h-7 w-7 rounded-full bg-muted-foreground/50 ${isFav && "bg-primary hover:bg-muted-foreground/50"}`}
        onClick={handleFavoriteClick}
      >
        <HeartIcon fill="white" size="20" />
      </Button>
    </div>
  );
};

export default RestaurantImage;
