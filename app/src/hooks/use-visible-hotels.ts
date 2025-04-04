import { useHotelStore } from "@/store";
import { useMemo } from "react";

export function useVisibleHotels() {
  const hotels = useHotelStore((state) => state.hotels?.data);
  const hiddenHotels = useHotelStore((state) => state.hiddenHotels);
  const visibleHotels = useMemo(() => {
    return hotels?.filter((h) => !hiddenHotels.includes(h.publicKey));
  }, [hotels, hiddenHotels]);

  return visibleHotels;
}
