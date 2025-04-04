import { useCallback, useMemo } from "react";
import { PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { MagicHotel } from "@/lib/magic_hotel";
import MagicHotelIdl from "@/lib/magic_hotel.json";
import { useProvider } from "./use-provider";
import { PLAYER_PDA_SEED } from "@/lib/constants";
import { useHotelStore } from "@/store";
import { Player } from "@/lib/types";
import { useWallet } from "@solana/wallet-adapter-react";

export function useMagicHotelProgram() {
  const { provider, ephemeralProvider } = useProvider();
  const wallet = useWallet();
  const program = useMemo(() => {
    if (provider) {
      return new Program<MagicHotel>(MagicHotelIdl as any, provider);
    }
  }, [provider]);
  const ephemeralProgram = useMemo(() => {
    if (ephemeralProvider) {
      return new Program<MagicHotel>(MagicHotelIdl as any, ephemeralProvider);
    }
  }, [ephemeralProvider]);
  const hotel = useHotelStore((state) => state.currentHotel);

  const createPlayer = useCallback(async () => {
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    if (!wallet || !wallet.signTransaction) {
      throw new Error("Wallet not found");
    }

    const { tx: rawTx } = await fetch("/api/tx/create-player", {
      method: "POST",
      body: JSON.stringify({
        hotel: hotel.publicKey,
        owner: wallet.publicKey,
        ephemeral: false,
      }),
    }).then((res) => res.json());

    const tx = Transaction.from(Buffer.from(rawTx, "base64"));
    const signedTx = await wallet.signTransaction(tx);

    await fetch("/api/tx/send", {
      method: "POST",
      body: JSON.stringify({
        txs: [{ tx: signedTx.serialize(), ephemeral: false }],
      }),
    });
  }, [program, hotel]);

  const enterHotel = useCallback(
    async (player: Player) => {
      if (!hotel) {
        throw new Error("Hotel not found");
      }
      if (!wallet || !wallet.signAllTransactions) {
        throw new Error("Wallet not found");
      }

      const { txs: rawTxs, error }: { txs: string[]; error?: any } =
        await fetch("/api/tx/enter-hotel", {
          method: "POST",
          body: JSON.stringify({
            hotel: hotel.publicKey.toString(),
            owner: wallet.publicKey?.toString(),
            playerId: player.account.id.toString(),
          }),
        }).then((res) => res.json());

      if (error) {
        console.error("Error entering hotel", error);
        throw Error(error);
      }

      const [signedDelegateTx, signedEnterTx] =
        await wallet.signAllTransactions(
          rawTxs.map((tx) => Transaction.from(Buffer.from(tx, "base64")))
        );

      await fetch("/api/tx/send", {
        method: "POST",
        body: JSON.stringify({
          txs: [
            { tx: signedDelegateTx.serialize(), ephemeral: false },
            { tx: signedEnterTx.serialize(), ephemeral: true },
          ],
        }),
      });
    },
    [program, ephemeralProgram, hotel]
  );

  const movePlayer = useCallback(
    async (player: Player, destination: number) => {
      if (!hotel) {
        throw new Error("Hotel not found");
      }
      if (!wallet || !wallet.signTransaction) {
        throw new Error("Wallet not found");
      }

      const { tx: rawTx, error }: { tx: string; error?: any } = await fetch(
        "/api/tx/move-player",
        {
          method: "POST",
          body: JSON.stringify({
            hotel: hotel.publicKey.toString(),
            owner: wallet.publicKey?.toString(),
            player: player.publicKey.toString(),
            room: player.account.position?.room.toString(),
            destination,
          }),
        }
      ).then((res) => res.json());

      if (error) {
        console.error("Error moving", error);
        throw Error(error);
      }

      const signedTx = await wallet.signTransaction(
        Transaction.from(Buffer.from(rawTx, "base64"))
      );

      await fetch("/api/tx/send", {
        method: "POST",
        body: JSON.stringify({
          txs: [{ tx: signedTx.serialize(), ephemeral: true }],
        }),
      });
    },
    [program, ephemeralProgram, hotel]
  );

  return { createPlayer, enterHotel, movePlayer, program };
}
