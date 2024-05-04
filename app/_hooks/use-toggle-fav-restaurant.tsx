import { toast } from "sonner";
import { toggleFavoriteRestaurant } from "../_actions/restaurant";
import { UserFavoriteRestaurant } from "@prisma/client";
import { useRouter } from "next/navigation";

interface UseToggleFavRestaurantProps {
  userId?: string;
  userFavoriteRestaurants?: UserFavoriteRestaurant[];
  restaurantId: string;
  restaurantIsFavorited?: boolean;
}

const useToggleFavRestaurant = ({
  userId,
  restaurantId,
  restaurantIsFavorited,
}: UseToggleFavRestaurantProps) => {
  const router = useRouter();
  const handleFavoriteClick = async () => {
    if (!userId) return;
    try {
      await toggleFavoriteRestaurant(userId, restaurantId);

      toast(
        restaurantIsFavorited
          ? "Restaurante removido dos favoritos!"
          : "Restaurante favoritado com sucesso!",
        {
          action: {
            label: "Ver favoritos",
            onClick: () => router.push(`/my-favorite-restaurants`),
          },
        },
      );
    } catch (error) {
      toast.error("Erro ao favoritar o restaurante..");
    }
  };

  return { handleFavoriteClick };
};

export default useToggleFavRestaurant;
