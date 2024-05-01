"use client";
import { Restaurant } from "@prisma/client";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchForRestaurant } from "./_actions/search";
import Header from "../_components/header";
import RestaurantItem from "../_components/restaurant-item";

const Restaurants = () => {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const searchFor = searchParams.get("search");
      if (!searchFor) return;
      const foundRestaurant = await searchForRestaurant(searchFor);
      setRestaurants(foundRestaurant);
    };

    fetchRestaurants();
  }, [searchParams]);

  const searchFor = searchParams.get("search");

  if (!searchFor) {
    return notFound();
  }

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">Restaurantes Encontrados</h2>
        <div className="grid grid-cols-2 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantItem
              restaurant={restaurant}
              key={restaurant.id}
              className="min-w-full max-w-full"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Restaurants;
