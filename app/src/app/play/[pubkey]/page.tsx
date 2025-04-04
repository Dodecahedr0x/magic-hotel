"use client";

import { useHotelStore } from "@/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import GameCanvas from "@/components/game/canvas";

export default function Page({ params }: { params: { pubkey: string } }) {
  const router = useRouter();
  const player = useHotelStore((state) => state.currentPlayer);
  const d = useHotelStore((state) => state.playersOnRooms);
  const playersOnRoom = useHotelStore((state) =>
    state.currentPlayer?.account.position
      ? state.playersOnRooms?.[
          state.currentPlayer.account.position.room.toString()
        ]
      : undefined
  );
  const room = useHotelStore((state) =>
    state.currentPlayer?.account.position
      ? state.rooms?.[state.currentPlayer.account.position.room.toString()]
      : undefined
  );
  const fetchCurrentPlayer = useHotelStore((state) => state.fetchCurrentPlayer);
  const fetchPlayersOnRoom = useHotelStore((state) => state.fetchPlayersOnRoom);
  const fetchRoom = useHotelStore((state) => state.fetchRoom);
  console.log(player, params, playersOnRoom, room, d);

  useEffect(() => {
    fetchCurrentPlayer(player?.publicKey);
  }, [player?.publicKey, router]);

  useEffect(() => {
    if (
      params.pubkey === player?.publicKey.toString() &&
      player?.account.position?.room
    ) {
      fetchRoom(player.account.position.room);
      fetchPlayersOnRoom(player.account.position.room);
    }
  }, [params.pubkey, player?.account.position?.room, router]);

  if (playersOnRoom?.error) return <div>Failed to load players</div>;
  if (room?.error) return <div>Failed to load room</div>;
  if (
    (playersOnRoom?.loading || room?.loading) &&
    !playersOnRoom?.data &&
    !room?.data
  )
    return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <GameCanvas room={room?.data} players={playersOnRoom?.data} />
    </div>
  );
}
