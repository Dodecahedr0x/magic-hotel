import { MAGICBLOCK_RPC, RPC_URL } from "@/lib/constants";
import { getProgram } from "@/lib/utils";
import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelPublicKey = searchParams.get("hotel");
  const ownerPublicKey = searchParams.get("owner");

  let hotel: PublicKey | undefined;
  let owner: PublicKey | undefined;
  try {
    hotel = new PublicKey(hotelPublicKey!);
    owner = new PublicKey(ownerPublicKey!);
  } catch (error) {
    return NextResponse.json(
      { error: "hotel and owner are required" },
      { status: 400 }
    );
  }

  const program = getProgram(RPC_URL);
  const ephemeralProgram = getProgram(MAGICBLOCK_RPC);
  const filters = [
    {
      memcmp: {
        offset: 73,
        bytes: hotel.toBase58(),
      },
    },
    {
      memcmp: {
        offset: 41,
        bytes: owner.toBase58(),
      },
    },
  ];
  const players = await program.account.player.all(filters);
  const ephemeralPlayers = await ephemeralProgram.account.player.all(filters);

  return NextResponse.json([
    ...players.map((p) => ({ ...p, delegated: false })),
    ...ephemeralPlayers.map((p) => ({ ...p, delegated: true })),
  ]);
}
