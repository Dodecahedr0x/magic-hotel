"use client";

import { Player, Room } from "@/lib/types";
import { useCallback, useEffect, useRef } from "react";
import tilesetImage from "@/assets/tileset.png";
import characterImage from "@/assets/character.png";
import { useHotelStore } from "@/store";
import { useMagicHotelProgram } from "@/hooks/use-magic-hotel-program";

export default function GameCanvas({
  room,
  players,
}: {
  room?: Room;
  players?: Player[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tilesetRef = useRef<HTMLImageElement | null>(null);
  const characterRef = useRef<HTMLImageElement | null>(null);
  const currentPlayer = useHotelStore((state) => state.currentPlayer);
  const fetchRoom = useHotelStore((state) => state.fetchRoom);
  const fetchCurrentPlayer = useHotelStore((state) => state.fetchCurrentPlayer);
  const { movePlayer } = useMagicHotelProgram();

  const drawRoom = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      tileset: HTMLImageElement,
      character: HTMLImageElement
    ) => {
      const tileSize = 64;
      const roomSize = room ? Math.sqrt(room.account.cells.length) : 8;
      const roomsPlayers = players || [];

      for (let y = 0; y < roomSize; y++) {
        for (let x = 0; x < roomSize; x++) {
          const { occupant, tile: tileIndex } = room?.account.cells[
            y * roomSize + x
          ] || { occupant: null, tile: 0 };
          const tileX = (tileIndex % (tileset.width / tileSize)) * tileSize;
          const tileY =
            Math.floor(tileIndex / (tileset.width / tileSize)) * tileSize;

          ctx.drawImage(
            tileset,
            tileX,
            tileY,
            tileSize,
            tileSize,
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize
          );

          if (occupant) {
            const player = roomsPlayers.find((p) => p.publicKey === occupant);
            const index = player?.account.position?.cellIndex;

            if (index !== undefined) {
              const characterX =
                (index % (character.width / tileSize)) * tileSize;
              const characterY =
                Math.floor(index / (character.width / tileSize)) * tileSize;

              ctx.drawImage(
                character,
                characterX,
                characterY,
                character.width,
                character.height,
                x * tileSize,
                y * tileSize,
                tileSize,
                tileSize
              );
            }
          }
        }
      }
    },
    [room, players]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Make the canvas focusable and focus it
    canvas.tabIndex = 0;
    canvas.focus();

    const context = canvas.getContext("2d");
    if (!context) return;

    const tileset = new Image();
    tileset.src = tilesetImage.src;
    tilesetRef.current = tileset;

    const character = new Image();
    character.src = characterImage.src;
    characterRef.current = character;

    tileset.onload = () => {
      drawRoom(context, tileset, character);
    };

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (!currentPlayer?.account.position || !room || !currentPlayer) return;
      const roomSize = Math.sqrt(room.account.cells.length);
      const position = currentPlayer.account.position.cellIndex;

      let destination;
      switch (e.key) {
        case "ArrowUp":
          destination = position - roomSize;
          break;
        case "ArrowDown":
          destination = position + roomSize;
          break;
        case "ArrowLeft":
          destination = position - 1;
          break;
        case "ArrowRight":
          destination = position + 1;
          break;
      }
      console.log(destination);
      if (
        destination !== undefined &&
        tilesetRef.current &&
        characterRef.current &&
        context
      ) {
        await movePlayer(currentPlayer, room, destination);
        await fetchCurrentPlayer(currentPlayer.publicKey, true);
        await fetchRoom(currentPlayer.account.position.room);
        drawRoom(context, tilesetRef.current, characterRef.current);
      }
    };

    canvas.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    room,
    canvasRef,
    drawRoom,
    currentPlayer,
    movePlayer,
    fetchCurrentPlayer,
    fetchRoom,
  ]);

  console.log(room, players);

  return (
    <canvas
      ref={canvasRef}
      width={512}
      height={512}
      className="border border-black outline-none m-5"
    />
  );
}
