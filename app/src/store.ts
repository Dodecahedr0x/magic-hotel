import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createUserSlice, UserSlice } from "./slices/user-slice";
import { ApiSlice, createApiSlice } from "./slices/api-slice";

export type SetStore<T> = (
  store: T | Partial<T> | ((state: T) => T | Partial<T>)
) => void;
export type GetStore<T> = () => T;

export type HotelStore = ApiSlice & UserSlice;

export const useHotelStore = create<HotelStore>()(
  persist(
    (set, get) => ({
      ...createApiSlice(set, get),
      ...createUserSlice(set),
    }),
    {
      name: "hotel-storage",
      partialize: (state) => ({
        hotels: state.hotels,
        hiddenHotels: state.hiddenHotels,
        currentHotel: state.currentHotel,
        currentPlayer: state.currentPlayer,
      }),
    }
  )
);
