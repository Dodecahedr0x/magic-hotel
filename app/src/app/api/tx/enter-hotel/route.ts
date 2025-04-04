import { MAGICBLOCK_RPC, PLAYER_PDA_SEED, RPC_URL } from "@/lib/constants";
import { getProgram } from "@/lib/utils";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { hotel, owner, playerId } = await request.json();
    const program = getProgram(RPC_URL);
    const ephemeralProgram = getProgram(MAGICBLOCK_RPC);
    if (!owner) {
      throw new Error("Owner not provided");
    }
    if (!hotel) {
      throw new Error("Hotel not provided");
    }
    if (!playerId) {
      throw new Error("Player ID not provided");
    }

    const ownerPk = new PublicKey(owner);
    const hotelPk = new PublicKey(hotel);
    const id = new PublicKey(playerId);
    const playerPda = PublicKey.findProgramAddressSync(
      [PLAYER_PDA_SEED, hotelPk.toBuffer(), id.toBuffer()],
      program.programId
    )[0];

    const hotelAccount = await program.account.hotel.fetch(hotelPk);

    const delegateTx = await program.methods
      .delegatePlayer({
        hotel: hotelPk,
        playerId: id,
      })
      .accountsPartial({
        pda: playerPda,
        payer: ownerPk,
      })
      .transaction();
    delegateTx.recentBlockhash = (
      await program.provider.connection.getLatestBlockhash()
    ).blockhash;
    delegateTx.feePayer = ownerPk;

    const enterTx = await ephemeralProgram.methods
      .enterHotel()
      .accountsPartial({
        hotel: hotelPk,
        room: hotelAccount.genesis.room,
        player: playerPda,
        user: ownerPk,
      })
      .transaction();
    enterTx.recentBlockhash = (
      await ephemeralProgram.provider.connection.getLatestBlockhash()
    ).blockhash;
    enterTx.feePayer = ownerPk;

    const txs = [delegateTx, enterTx].map((tx) =>
      tx
        .serialize({ requireAllSignatures: false, verifySignatures: false })
        .toString("base64")
    );
    return NextResponse.json({
      txs,
    });
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
