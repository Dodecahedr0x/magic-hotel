import { MAGICBLOCK_RPC, RPC_URL } from "@/lib/constants";
import { getProgram } from "@/lib/utils";
import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { DELEGATION_PROGRAM_ID } from "@magicblock-labs/ephemeral-rollups-sdk";

export async function GET(
  request: Request,
  { params: { pubkey } }: { params: { pubkey: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const delegated = searchParams.get("delegated") === "true";
    const player = new PublicKey(pubkey);

    // Short path to reduce RPC calls
    const ephemeralProgram = getProgram(MAGICBLOCK_RPC);
    if (delegated) {
      console.log(
        "Delegated",
        await ephemeralProgram.provider.connection.getAccountInfo(player)
      );
      const ephemeralPlayerAccount =
        await ephemeralProgram.account.player.fetch(player);
      return NextResponse.json({
        player: {
          account: ephemeralPlayerAccount,
          publicKey: player,
          delegated: true,
        },
      });
    }

    const program = getProgram(RPC_URL);
    const playerAccountInfo = await program.provider.connection.getAccountInfo(
      player
    );

    if (playerAccountInfo?.owner?.equals(DELEGATION_PROGRAM_ID)) {
      const ephemeralPlayerAccount =
        await ephemeralProgram.account.player.fetch(player);
      return NextResponse.json({
        player: {
          account: ephemeralPlayerAccount,
          publicKey: player,
          delegated: true,
        },
      });
    }

    const playerAccount = await program.account.player.fetch(player);

    return NextResponse.json({
      player: {
        account: playerAccount,
        publicKey: player,
        delegated: false,
      },
    });
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
