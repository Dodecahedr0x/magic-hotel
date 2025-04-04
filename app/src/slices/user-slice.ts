import { Hotel, Player } from "@/lib/types";
import { HotelStore, SetStore } from "@/store";
import { PublicKey } from "@solana/web3.js";

export type UserSlice = {
  hiddenHotels: PublicKey[];
  currentHotel?: Hotel;
  currentPlayer?: Player | undefined;
  setCurrentHotel: (hotel: Hotel) => void;
  hideHotel: (hotel: Hotel) => void;
  unhideHotel: (hotel: Hotel) => void;
  setCurrentPlayer: (player: Player) => void;
};

export const createUserSlice = (set: SetStore<HotelStore>): UserSlice => ({
  hiddenHotels: [],
  setCurrentHotel: (hotel) => {
    set(() => ({ currentHotel: hotel }));
  },
  hideHotel: (hotel) => {
    set((state) => ({
      hiddenHotels: [...state.hiddenHotels, hotel.publicKey],
    }));
  },
  unhideHotel: (hotel) => {
    set((state) => ({
      hiddenHotels: state.hiddenHotels.filter(
        (h) => !h.equals(hotel.publicKey)
      ),
    }));
  },
  setCurrentPlayer: (player) => {
    set(() => ({ currentPlayer: player }));
  },
});
