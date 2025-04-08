"use client";

import { RPC_URL } from "@/lib/constants";
import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";
import { ReactNode, useCallback } from "react";
import { MagicBlockEngineProvider } from "./magic-block-provider";

require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
  }
);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = RPC_URL;
  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
        <WalletModalProvider>
          <MagicBlockEngineProvider>{children}</MagicBlockEngineProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
