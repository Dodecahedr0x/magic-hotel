import { HotelStore, SetStore } from "@/store";
import { Keypair } from "@solana/web3.js";

export type WalletSlice = {
  secretKey?: Uint8Array | null;
  newSecretKey: () => void;
};

export const createWalletSlice = (set: SetStore<HotelStore>): WalletSlice => ({
  newSecretKey: () => {
    set(() => ({ secretKey: Keypair.generate().secretKey }));
  },
});
