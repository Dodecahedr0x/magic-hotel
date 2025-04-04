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
  let room = new PublicKey(roomPk!);

  const program = getProgram(delegated ? MAGICBLOCK_RPC : RPC_URL);
  const roomAccount = await program.account.room.fetch(room);

  return NextResponse.json({
    publicKey: room.toBase58(),
    account: roomAccount,
    delegated,
  });
}
