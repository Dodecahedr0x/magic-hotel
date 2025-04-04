import { Player } from "@/lib/types";
import { useCallback } from "react";
import useSWR, { mutate } from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export function useDelegationStatus(player: Player) {
  const { data, error, isLoading } = useSWR(
    `/api/ephemeral/delegation-status?player=${player.publicKey.toString()}`,
    fetcher
  );

  const refresh = useCallback(() => {
    mutate(
      `/api/ephemeral/delegation-status?player=${player.publicKey.toString()}`
    );
  }, [player]);
  console.log(data, error, isLoading);

  return { delegated: data, error, isLoading, refresh };
}
