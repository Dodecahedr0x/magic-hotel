"use client";

import { Player } from "@/lib/types";
import { Button } from "../ui/button";
import { useMagicHotelProgram } from "@/hooks/use-magic-hotel-program";
import { useCallback } from "react";
import { PlayerCard } from "./player-card";
import { useHotelStore } from "@/store";
import { useWallet } from "@solana/wallet-adapter-react";

interface PlayerListProps {
  players?: Player[];
}

function PlayerListContent({ players }: PlayerListProps) {
  if (!players || players.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No players found
      </div>
    );
  } else {
    console.log(players)
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{players.map((player, index) => (
      <PlayerCard key={index} player={player} />
    ))}
    </div>
  }
}

export function PlayerList({ players }: PlayerListProps) {
  const {createPlayer} = useMagicHotelProgram();
  const owner = useWallet().publicKey;
  const  fetchOwnedPlayers = useHotelStore((state) => state.fetchOwnedPlayers);

  const handleCreatePlayer = useCallback(async () => {
    if (!owner) return;
    await createPlayer();
    await new Promise(resolve => setTimeout(resolve, 1000)); // HACK: sleep to ensure the player is updated
    await fetchOwnedPlayers(owner);
  }, [createPlayer, fetchOwnedPlayers, owner]);

  return (
    <div className="flex flex-col gap-4 py-4">
      <PlayerListContent players={players} />
      <Button onClick={handleCreatePlayer}>Create Player</Button>
    </div>
  );
}
