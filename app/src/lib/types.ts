import { MagicHotel } from "@/lib/magic_hotel";
import { IdlAccounts } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export type KeyedAccount<T> = {
  publicKey: PublicKey;
  account: T;
  delegated?: boolean;
};
export type HotelAccount = IdlAccounts<MagicHotel>["hotel"];
export type PlayerAccount = IdlAccounts<MagicHotel>["player"];
export type RoomAccount = IdlAccounts<MagicHotel>["room"];
export type Hotel = KeyedAccount<HotelAccount>;
export type Player = KeyedAccount<PlayerAccount>;
export type Room = KeyedAccount<RoomAccount>;
