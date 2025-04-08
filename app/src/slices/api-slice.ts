import { Hotel, Player, Room } from "@/lib/types";
import { GetStore, HotelStore, SetStore } from "@/store";
import { PublicKey } from "@solana/web3.js";

type ApiResponse<T> = {
  data?: T;
  error: string | null;
  loading: boolean;
};

export type ApiSlice = {
  hotels?: ApiResponse<Hotel[]>;
  ownedPlayers?: ApiResponse<Player[]>;
  rooms: { [roomPk: string]: ApiResponse<Room> };
  playersOnRooms: { [roomPk: string]: ApiResponse<Player[]> };
  fetchHotels: () => Promise<void>;
  fetchOwnedPlayers: (owner: PublicKey) => Promise<void>;
  fetchRoom: (room: PublicKey, delegated?: boolean) => Promise<void>;
  fetchPlayersOnRoom: (room: PublicKey, delegated?: boolean) => Promise<void>;
  fetchCurrentPlayer: (
    playerPk?: PublicKey,
    delegated?: boolean
  ) => Promise<void>;
};

export const createApiSlice = (
  set: SetStore<HotelStore>,
  get: GetStore<HotelStore>
): ApiSlice => ({
  rooms: {},
  playersOnRooms: {},
  fetchHotels: async () => {
    set({
      hotels: { data: get().hotels?.data, loading: true, error: null },
    });
    try {
      const res = await fetch("/api/hotels");
      const result = await res.json();
      set({ hotels: { data: result, loading: false, error: null } });
    } catch (err: any) {
      set({
        hotels: { error: err.message || "Failed to fetch", loading: false },
      });
    }
  },
  fetchOwnedPlayers: async (owner) => {
    set({
      ownedPlayers: {
        data: get().ownedPlayers?.data,
        loading: true,
        error: null,
      },
    });
    try {
      const res = await fetch(
        `/api/players?hotel=${
          get().currentHotel?.publicKey
        }&owner=${owner.toString()}`
      );
      const result = await res.json();
      set({ ownedPlayers: { data: result, loading: false, error: null } });
    } catch (err: any) {
      set({
        ownedPlayers: {
          error: err.message || "Failed to fetch",
          loading: false,
        },
      });
    }
  },
  fetchRoom: async (room, delegated = true) => {
    set({
      rooms: {
        [room.toString()]: {
          data: get().rooms?.[room.toString()]?.data,
          loading: true,
          error: null,
        },
      },
    });
    try {
      const res = await fetch(`/api/room/${room}?delegated=${!!delegated}`);
      const result = await res.json();
      set({
        rooms: {
          [room.toString()]: { data: result, loading: false, error: null },
        },
      });
    } catch (err: any) {
      set({
        rooms: {
          [room.toString()]: {
            error: err.message || "Failed to fetch",
            loading: false,
          },
        },
      });
    }
  },
  fetchPlayersOnRoom: async (room, delegated = true) => {
    set({
      playersOnRooms: {
        [room.toString()]: {
          data: get().ownedPlayers?.data,
          loading: true,
          error: null,
        },
      },
    });
    try {
      const res = await fetch(
        `/api/room/${room}/players?delegated=${!!delegated}`
      );
      const result = await res.json();
      set({
        playersOnRooms: {
          [room.toString()]: { data: result, loading: false, error: null },
        },
      });
    } catch (err: any) {
      set({
        playersOnRooms: {
          [room.toString()]: {
            error: err.message || "Failed to fetch",
            loading: false,
          },
        },
      });
    }
  },
  fetchCurrentPlayer: async (playerPk, delegated) => {
    const res = await fetch(
      `/api/players/${
        playerPk?.toString() ?? get().currentPlayer?.publicKey
      }?delegated=${!!delegated}`
    );
    const { player, error } = await res.json();

    if (error) {
      throw new Error(error);
    }

    set({
      currentPlayer: player,
    });
  },
});
