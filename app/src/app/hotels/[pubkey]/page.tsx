"use client";

import { PlayerList } from "@/components/player/player-list";
import { useWallet } from "@solana/wallet-adapter-react";
import { useHotelStore } from "@/store";
import { useEffect, useMemo } from "react";
import { useMagicBlockEngine } from "@/hooks/use-magic-block-engine";

export default function Page({ params }: { params: { pubkey: string } }) {
  const error = useHotelStore((state) => state.ownedPlayers?.error);
  const loading = useHotelStore((state) => state.ownedPlayers?.loading);
  const players = useHotelStore((state) => state.ownedPlayers?.data);
  const engine = useMagicBlockEngine();
  const owner = useMemo(() => {
    return engine?.getSessionPayer();
  }, [engine]);
  const fetchOwnedPlayers = useHotelStore((state) => state.fetchOwnedPlayers);
  console.log(players, params);

  useEffect(() => {
    if (owner) {
      fetchOwnedPlayers(owner);
    }
    console.log("fetching players", owner);
  }, [fetchOwnedPlayers, owner]);

  if (error) return <div>Failed to load players</div>;
  if (loading) return <div>Loading...</div>;

  return <PlayerList players={players} />;
}
