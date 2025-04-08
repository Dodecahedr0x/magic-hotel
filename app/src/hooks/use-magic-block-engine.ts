"use client";

import { MagicBlockEngineContext } from "@/components/solana/magic-block-provider";
import { useContext } from "react";

export function useMagicBlockEngine() {
  return useContext(MagicBlockEngineContext);
}
