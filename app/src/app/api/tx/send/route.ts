import { MAGICBLOCK_RPC, RPC_URL } from "@/lib/constants";
import { NextResponse } from "next/server";
import { Connection, Transaction } from "@solana/web3.js";

export async function POST(request: Request) {
  try {
    const { txs } = await request.json();

    const signatures = [];
    for (const { tx, ephemeral } of txs) {
      const connection = new Connection(ephemeral ? MAGICBLOCK_RPC : RPC_URL);
      const transaction = Transaction.from(Buffer.from(tx, "base64"));

      const signature = await connection.sendRawTransaction(
        transaction.serialize()
      );
      await connection.confirmTransaction(signature);
      signatures.push(signature);
    }

    return NextResponse.json({ signatures });
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
