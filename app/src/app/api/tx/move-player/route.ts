import { MAGICBLOCK_RPC, RPC_URL } from "@/lib/constants";
import { getProgram } from "@/lib/utils";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { hotel, owner, player, destination, room } = await request.json();
    const ephemeralProgram = getProgram(MAGICBLOCK_RPC);
    if (!owner) {
      throw new Error("Owner not provided");
    }
    if (!hotel) {
      throw new Error("Hotel not provided");
    }
    if (!player) {
      throw new Error("Player not provided");
    }
    if (!room) {
      throw new Error("Room not provided");
    }

    console.log(hotel, owner, player, destination, room);
    const ownerPk = new PublicKey(owner);
    const hotelPk = new PublicKey(hotel);
    const playerPk = new PublicKey(player);
    const roomPk = new PublicKey(room);

    const tx = await ephemeralProgram.methods
      .movePlayer({
        destinationIndex: destination,
      })
      .accountsPartial({
        hotel: hotelPk,
        room: roomPk,
        player: playerPk,
        owner: ownerPk,
      })
      .transaction();
    tx.recentBlockhash = (
      await ephemeralProgram.provider.connection.getLatestBlockhash()
    ).blockhash;
    tx.feePayer = ownerPk;

    return NextResponse.json({
      tx: tx
        .serialize({ requireAllSignatures: false, verifySignatures: false })
        .toString("base64"),
    });
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
