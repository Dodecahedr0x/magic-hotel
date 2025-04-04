'use client'

import { PlayerList } from '@/components/player/player-list'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHotelStore } from '@/store'
import { useEffect } from 'react'

export default function Page({ params }: { params: { pubkey: string } }) {
  const owner = useWallet().publicKey;
  const error  = useHotelStore((state) => state.ownedPlayers?.error);
  const loading  = useHotelStore((state) => state.ownedPlayers?.loading);
  const players  = useHotelStore((state) => state.ownedPlayers?.data);
  const fetchOwnedPlayers  = useHotelStore((state) => state.fetchOwnedPlayers);
  console.log(players, params)

  useEffect(() => {
    if(owner) {
      fetchOwnedPlayers(owner);
    }
  }, [fetchOwnedPlayers, owner]);

  if (error) return <div>Failed to load players</div>;
  if (loading) return <div>Loading...</div>;

  return (
      <PlayerList players={players} />
  );
}
