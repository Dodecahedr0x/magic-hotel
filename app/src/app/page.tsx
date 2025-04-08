"use client";

import { Button } from "@/components/ui/button";
import { useMagicBlockEngine } from "@/hooks/use-magic-block-engine";
import { useSessionKey } from "@/hooks/use-session-key";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";

export default function Page() {
  const sessionKey = useSessionKey();
  const wallet = useWallet();
  const engine = useMagicBlockEngine();

  const handleTransfer = async () => {
    if (!wallet.publicKey || !sessionKey) return;

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: sessionKey.publicKey,
        lamports: LAMPORTS_PER_SOL,
      })
    );
    tx.feePayer = wallet.publicKey;
    tx.recentBlockhash = (
      await engine?.getConnectionChain()?.getLatestBlockhash()
    )?.blockhash;

    engine?.processWalletTransaction("transfer", tx);
  };

  return (
    <div className="flex flex-col gap-4 mx-auto p-4">
      Start by transfering some devnet SOL to{" "}
      {sessionKey?.publicKey?.toBase58()}
      <Button onClick={handleTransfer}>Transfer SOL</Button>
    </div>
  );
}
