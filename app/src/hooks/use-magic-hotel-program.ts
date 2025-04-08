import { useCallback, useMemo } from "react";
import { PublicKey, Keypair } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { MagicHotel } from "@/lib/magic_hotel";
import MagicHotelIdl from "@/lib/magic_hotel.json";
import { useProvider } from "./use-provider";
import { PLAYER_PDA_SEED } from "@/lib/constants";
import { useHotelStore } from "@/store";
import { Player, Room } from "@/lib/types";
import { useMagicBlockEngine } from "./use-magic-block-engine";

export function useMagicHotelProgram() {
  const { provider, ephemeralProvider } = useProvider();
  const engine = useMagicBlockEngine();
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
    if (!engine) {
      throw new Error("Engine not found");
    }
    if (!program) {
      throw new Error("Program not found");
    }

    const hotelPk = new PublicKey(hotel.publicKey);
    const playerId = Keypair.generate().publicKey;
    const player = PublicKey.findProgramAddressSync(
      [PLAYER_PDA_SEED, hotelPk.toBuffer(), playerId.toBuffer()],
      program.programId
    )[0];

    console.log("player", {
      hotel: hotelPk,
      player,
      user: engine.getSessionPayer(),
    });
    const tx = await program.methods
      .createPlayer({ playerId })
      .accountsPartial({
        hotel: hotelPk,
        player,
        user: engine.getSessionPayer(),
      })
      .transaction();
    tx.recentBlockhash = (
      await program.provider.connection.getLatestBlockhash()
    ).blockhash;
    tx.feePayer = engine.getSessionPayer()!;

    return engine.processSessionChainTransaction("create-player", tx);
  }, [program, hotel, engine]);

  const enterHotel = useCallback(
    async (player: Player) => {
      if (!hotel) {
        throw new Error("Hotel not found");
      }
      if (!engine) {
        throw new Error("Engine not found");
      }
      if (!ephemeralProgram || !program) {
        throw new Error("Program not found");
      }

      const hotelPk = new PublicKey(hotel.publicKey);

      const delegateTx = await program.methods
        .delegatePlayer({
          hotel: hotelPk,
          playerId: new PublicKey(player.account.id),
        })
        .accountsPartial({
          pda: new PublicKey(player.publicKey),
          payer: engine.getSessionPayer()!,
        })
        .transaction();
      delegateTx.recentBlockhash = (
        await program.provider.connection.getLatestBlockhash()
      ).blockhash;
      delegateTx.feePayer = engine.getSessionPayer()!;

      const enterTx = await ephemeralProgram.methods
        .enterHotel()
        .accountsPartial({
          hotel: hotelPk,
          room: hotel.account.genesis.room,
          player: new PublicKey(player.publicKey),
          user: engine.getSessionPayer()!,
        })
        .transaction();
      enterTx.recentBlockhash = (
        await ephemeralProgram.provider.connection.getLatestBlockhash()
      ).blockhash;
      enterTx.feePayer = engine.getSessionPayer()!;

      await engine.processSessionChainTransaction("delegate", delegateTx);
      await engine.processSessionEphemTransaction("enter-hotel", enterTx);
    },
    [hotel, engine, ephemeralProgram, program]
  );

  const movePlayer = useCallback(
    async (player: Player, room: Room, destination: number) => {
      if (!hotel) {
        throw new Error("Hotel not found");
      }
      if (!engine) {
        throw new Error("Engine not found");
      }
      if (!ephemeralProgram) {
        throw new Error("Program not found");
      }

      const ownerPk = new PublicKey(engine.getSessionPayer()!);
      const hotelPk = new PublicKey(hotel.publicKey);
      const playerPk = new PublicKey(player.publicKey);
      const roomPk = new PublicKey(room.publicKey);

      const tx = await ephemeralProgram.methods
        .movePlayer({
          destinationIndex: destination,
        })
        .accountsPartial({
          hotel: hotelPk,
          room: roomPk,
          player: playerPk,
          owner: ownerPk,
        })
        .transaction();
      tx.recentBlockhash = (
        await ephemeralProgram.provider.connection.getLatestBlockhash()
      ).blockhash;
      tx.feePayer = ownerPk;

      await engine.processSessionEphemTransaction("move", tx);
    },
    [hotel, engine, ephemeralProgram]
  );

  return { createPlayer, enterHotel, movePlayer, program };
}
