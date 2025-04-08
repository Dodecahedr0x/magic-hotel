import { useHotelStore } from "@/store";
import { Keypair } from "@solana/web3.js";
import { useMemo } from "react";

export function useSessionKey() {
  const secretKey = useHotelStore((state) => state.secretKey);
  const sessionKey = useMemo(() => {
    if (secretKey)
      return Keypair.fromSecretKey(Uint8Array.from(Object.values(secretKey)));
    return null;
  }, [secretKey]);

  return sessionKey;
}
