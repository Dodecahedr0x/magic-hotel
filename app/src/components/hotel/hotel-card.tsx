"use client";

import { Card } from "@/components/ui/card";
import { Hotel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useHotelStore } from "@/store";
import { useCallback } from "react";
import { IconArrowRight, IconEyeOff } from "@tabler/icons-react";
import { shortPubKey } from "@/lib/utils";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const setHotel = useHotelStore((state) => state.setCurrentHotel);
  const hideHotel = useHotelStore((state) => state.hideHotel);
  const router = useRouter();

  const handleViewHotel = useCallback(() => {
    setHotel(hotel);
    router.push(`/hotels/${hotel.publicKey.toString()}`);
  }, [hotel, router, setHotel]);

  const handleHideHotel = useCallback(() => {
    console.log("hiding hotel", hotel);
    hideHotel(hotel);
  }, [hotel, hideHotel]);

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        <div className="relative w-48 h-32">
          {/* <Image
            src={hotel.imageUrl}
            alt={hotel.name}
            fill
            className="object-cover rounded-lg"
          /> */}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{shortPubKey(hotel.publicKey)}</h2>
          <p className="text-gray-600 mt-2">{shortPubKey(hotel.account.id)}</p>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <span className="text-gray-600">Location: </span>
              {shortPubKey(hotel.account.genesis.room)}
            </div>
            <div>
              <span className="text-gray-600">Rating: </span>
              {hotel.account.genesis.cellIndex}/5
            </div>
            <div className="text-xl font-bold">
              ${hotel.account.roomSize}/night
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 my-auto">
          <Button onClick={handleViewHotel}>
            View
            <IconArrowRight />
          </Button>
          <Button onClick={handleHideHotel}>
            Hide
            <IconEyeOff />
          </Button>
        </div>
      </div>
    </Card>
  );
}
