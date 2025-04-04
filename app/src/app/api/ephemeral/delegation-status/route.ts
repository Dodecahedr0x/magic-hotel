import { RPC_URL } from "@/lib/constants";
import { Connection, PublicKey } from "@solana/web3.js";
import { DELEGATION_PROGRAM_ID } from "@magicblock-labs/ephemeral-rollups-sdk";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playerPk = searchParams.get("player");
  const connection = new Connection(RPC_URL);

  if (!playerPk) {
    return NextResponse.json({ error: "Player invalid" }, { status: 400 });
  }

  const player = await connection.getAccountInfo(new PublicKey(playerPk));
  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 400 });
  }

  return NextResponse.json(player.owner.equals(DELEGATION_PROGRAM_ID));
}
