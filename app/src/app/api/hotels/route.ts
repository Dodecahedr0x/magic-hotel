import { RPC_URL } from "@/lib/constants";
import { getProgram } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const program = getProgram(RPC_URL);
  const hotels = await program.account.hotel.all();
  return NextResponse.json(hotels);
}
