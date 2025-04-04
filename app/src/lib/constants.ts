import MagicHotelIdl from "./magic_hotel.json";

export const RPC_URL = `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;
export const MAGICBLOCK_RPC = `https://devnet.magicblock.app/`;

function bytesStringToBuffer(str: string) {
  return Buffer.from(
    Uint8Array.from(
      str
        .replaceAll(/[\[\]\s]/g, "")
        .split(",")
        .map(Number)
    )
  );
}

export const HOTEL_PDA_SEED = bytesStringToBuffer(
  MagicHotelIdl["constants"].find((c) => c.name === "HOTEL_PDA_SEED")!.value
);
export const ROOM_PDA_SEED = bytesStringToBuffer(
  MagicHotelIdl["constants"].find((c) => c.name === "ROOM_PDA_SEED")!.value
);
export const PLAYER_PDA_SEED = bytesStringToBuffer(
  MagicHotelIdl["constants"].find((c) => c.name === "PLAYER_PDA_SEED")!.value
);
