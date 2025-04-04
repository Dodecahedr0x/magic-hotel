'use client'

import { HotelCard } from "@/components/hotel/hotel-card"
import { useHotelStore } from "@/store"
import { useEffect } from "react"
import { useVisibleHotels } from "../hooks/use-visible-hotels"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"

export default function Page() {
  const fetchHotels  = useHotelStore((state) => state.fetchHotels)
  const error  = useHotelStore((state) => state.hotels?.error)
  const loading  = useHotelStore((state) => state.hotels?.loading)
  const hotels = useVisibleHotels()
  
  useEffect(() => {
    fetchHotels()
  }, [fetchHotels])
  
  if (error) return <div>Failed to load hotels</div>
  if (loading) return <div>Loading...</div>

  return (
    <div className="flex flex-col gap-4 mx-auto p-4">
      <Button onClick={() => {
        console.log(hotels)
      }}>
        Create a Hotel
        <IconPlus />
      </Button>
      <div className="space-y-4">
        {hotels?.map((hotel) => (
          <HotelCard key={hotel.publicKey.toString()} hotel={hotel} />
        ))}
      </div>
    </div>
  )
}
