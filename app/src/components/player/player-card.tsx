"use client";

import { Player } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useCallback } from "react";
import { IconPlayerPlay, IconSettings } from "@tabler/icons-react";
import { useHotelStore } from "@/store";
import { useRouter } from "next/navigation";
import { cn, shortPubKey } from "@/lib/utils";
import { useMagicHotelProgram } from "@/hooks/use-magic-hotel-program";
import { useDelegationStatus } from "@/hooks/use-delegation-status";

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const setCurrentPlayer = useHotelStore((state) => state.setCurrentPlayer);
  const { enterHotel } = useMagicHotelProgram();
  const router = useRouter();
  const {delegated, isLoading,refresh} = useDelegationStatus(player);
  
  const handlePlay = useCallback(() => {
    setCurrentPlayer(player);
    router.push(`/play/${player.publicKey.toString()}`);
  }, [router, setCurrentPlayer, player]);

  const handleDelegate = useCallback(async () => {
    await enterHotel(player);
    await new Promise(resolve => setTimeout(resolve, 1000)); // HACK: sleep to ensure the player is updated
    refresh();
  }, [enterHotel, refresh, player]);

  let actionButton;
  if(delegated) {
    actionButton = <Button className={cn("w-full", isLoading && "animate-spin")} onClick={handlePlay}><IconPlayerPlay /></Button>
  } else {
    actionButton = <Button className="w-full" onClick={handleDelegate}><IconSettings /></Button>
  }
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Player {shortPubKey(player.publicKey)}</h3>
            <div className="text-sm text-gray-600">
              <p>ID: {shortPubKey(player.account.id)}</p>
              <p>Position: ({player.account.position?.cellIndex} @ {shortPubKey(player.account.position?.room)})</p>
              <p>Owner: {shortPubKey(player.account.owner)}</p>
            </div>
            {actionButton}
          </div>
        </CardContent>
      </Card>
    );
}