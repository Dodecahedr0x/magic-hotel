import { useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { MAGICBLOCK_RPC, RPC_URL } from "@/lib/constants";

export function useProvider() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const provider = useMemo(() => {
    if (wallet) {
      return new AnchorProvider(connection, wallet as any);
    }
  }, [connection, wallet]);
  const ephemeralProvider = useMemo(() => {
    if (wallet) {
      return new AnchorProvider(new Connection(MAGICBLOCK_RPC), wallet as any);
    }
  }, [wallet]);

  return { provider, ephemeralProvider };
}
