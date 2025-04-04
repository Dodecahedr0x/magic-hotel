import { PLAYER_PDA_SEED, RPC_URL } from "@/lib/constants";
import { getProgram } from "@/lib/utils";
import { Keypair, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { hotel, owner } = await request.json();
    const program = getProgram(RPC_URL);
    if (!owner) {
      throw new Error("Owner not provided");
    }
    if (!hotel) {
      throw new Error("Hotel not provided");
    }
    console.log(hotel, owner);

    const ownerPk = new PublicKey(owner);
    const hotelPk = new PublicKey(hotel);
    const playerId = Keypair.generate().publicKey;
    const player = PublicKey.findProgramAddressSync(
      [PLAYER_PDA_SEED, hotelPk.toBuffer(), playerId.toBuffer()],
      program.programId
    )[0];

    const tx = await program.methods
      .createPlayer({ playerId })
      .accountsPartial({
        hotel: hotelPk,
        player,
        user: ownerPk,
      })
      .transaction();
    tx.recentBlockhash = (
      await program.provider.connection.getLatestBlockhash()
    ).blockhash;
    tx.feePayer = ownerPk;

    return NextResponse.json({
      tx: tx.serialize({
        verifySignatures: false,
        requireAllSignatures: false,
      }),
      playerId: playerId.toBase58(),
      player: player.toBase58(),
    });
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
