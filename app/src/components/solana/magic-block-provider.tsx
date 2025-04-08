"use client";

import { useSessionKey } from "@/hooks/use-session-key";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createContext, useMemo } from "react";
import { MagicBlockEngine } from "./magic-block-engine";

const SESSION_MIN_LAMPORTS = 0.02 * LAMPORTS_PER_SOL;
const SESSION_MAX_LAMPORTS = 0.05 * LAMPORTS_PER_SOL;

export const MagicBlockEngineContext = createContext<
  MagicBlockEngine | undefined
>(undefined);

export function MagicBlockEngineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const walletContext = useWallet();
  const sessionKey = useSessionKey();

  const engine = useMemo(() => {
    if (!sessionKey) return;

    return new MagicBlockEngine(walletContext, sessionKey, {
      minLamports: SESSION_MIN_LAMPORTS,
      maxLamports: SESSION_MAX_LAMPORTS,
    });
  }, [walletContext, sessionKey]);

  return (
    <MagicBlockEngineContext.Provider value={engine}>
      {children}
    </MagicBlockEngineContext.Provider>
  );
}
