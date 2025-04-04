import { MAGICBLOCK_RPC, RPC_URL } from "@/lib/constants";
import { getProgram } from "@/lib/utils";
import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";

export async function GET(
  request: Request,
  { params: { roomPk } }: { params: { roomPk: string } }
) {
  const { searchParams } = new URL(request.url);
  const delegated = searchParams.get("delegated") === "true";
  let room = new PublicKey(roomPk);
  const program = getProgram(delegated ? MAGICBLOCK_RPC : RPC_URL);
  const players = await program.account.player.all([
    {
      memcmp: {
        offset: 106,
        bytes: room.toBase58(),
      },
    },
  ]);

  return NextResponse.json(players.map((p) => ({ ...p, delegated })));
}
