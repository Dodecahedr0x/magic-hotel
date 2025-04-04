import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MagicHotel } from "@/lib/magic_hotel";
import MagicHotelIdl from "@/lib/magic_hotel.json";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProgram(rpcUrl: string): Program<MagicHotel> {
  const connection = new Connection(rpcUrl);
  const wallet = new NodeWallet(Keypair.generate());
  const program = new Program<MagicHotel>(
    MagicHotelIdl as MagicHotel,
    new AnchorProvider(connection, wallet)
  );
  return program;
}

export function shortPubKey(pubKey?: PublicKey): string {
  if (!pubKey) return "???";
  return pubKey.toString().slice(0, 4) + "..." + pubKey.toString().slice(-4);
}

export function cellIndexToCoords(
  cellIndex: number,
  mapSize: number
): { x: number; y: number } {
  return {
    x: cellIndex % mapSize,
    y: Math.floor(cellIndex / mapSize),
  };
}
