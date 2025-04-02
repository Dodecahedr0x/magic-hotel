import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MagicHotel } from "../target/types/magic_hotel";
import { DELEGATION_PROGRAM_ID } from "@magicblock-labs/ephemeral-rollups-sdk";
import * as dotenv from "dotenv";
import { assert } from "chai";
dotenv.config();

const HOTEL_PDA_SEED = "hotel:";
const MAP_PDA_SEED = "map:";
const PLAYER_PDA_SEED = "player:";

describe("ephemeral-orderbook", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const providerEphemeralRollup = new anchor.AnchorProvider(
    new anchor.web3.Connection(
      process.env.PROVIDER_ENDPOINT || "https://devnet.magicblock.app/",
      {
        wsEndpoint: process.env.WS_ENDPOINT || "wss://devnet.magicblock.app/",
      }
    ),
    anchor.Wallet.local()
  );

  const program = anchor.workspace.MagicHotel as Program<MagicHotel>;
  const ephemeralProgram = new Program(program.idl, providerEphemeralRollup);
  const hotelId = anchor.web3.Keypair.generate().publicKey;
  const map1Id = anchor.web3.Keypair.generate().publicKey;
  const map2Id = anchor.web3.Keypair.generate().publicKey;
  const playerId = anchor.web3.Keypair.generate().publicKey;
  const [hotelPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(HOTEL_PDA_SEED), hotelId.toBuffer()],
    program.programId
  );
  const [map1Pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(MAP_PDA_SEED), hotelPda.toBuffer(), map1Id.toBuffer()],
    program.programId
  );
  const [map2Pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(MAP_PDA_SEED), hotelPda.toBuffer(), map2Id.toBuffer()],
    program.programId
  );
  const [playerPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(PLAYER_PDA_SEED), hotelPda.toBuffer(), playerId.toBuffer()],
    program.programId
  );
  const mapSize = 8;

  it("Initializes the hotel", async () => {
    await program.methods
      .createHotel({
        hotelId,
        mapId: map1Id,
        mapSize,
        genesisMap: Buffer.from(Array(mapSize * mapSize).fill(1)),
        genesisPosition: 0,
      })
      .accountsPartial({
        hotel: hotelPda,
        map: map1Pda,
      })
      .rpc();

    await program.methods
      .createMap({
        id: map2Id,
        cells: Buffer.from(Array(mapSize * mapSize).fill(1)),
      })
      .accountsPartial({
        hotel: hotelPda,
        map: map2Pda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    await program.methods
      .createPlayer({
        playerId,
      })
      .accountsPartial({
        hotel: hotelPda,
        player: playerPda,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    await program.methods
      .enterHotel()
      .accountsPartial({
        hotel: hotelPda,
        map: map1Pda,
        player: playerPda,
        user: provider.wallet.publicKey,
      })
      .rpc();

    await program.methods
      .createConnection({
        originCellIndex: 1,
        destinationCellIndex: 0,
      })
      .accountsPartial({
        hotel: hotelPda,
        sourceMap: map1Pda,
        destinationMap: map2Pda,
      })
      .rpc();

    await program.methods
      .createConnection({
        originCellIndex: 0,
        destinationCellIndex: 1,
      })
      .accountsPartial({
        hotel: hotelPda,
        sourceMap: map2Pda,
        destinationMap: map1Pda,
      })
      .rpc();
  });

  it("Move player", async () => {
    await program.methods
      .movePlayer({
        destinationIndex: 1,
      })
      .accountsPartial({
        player: playerPda,
        hotel: hotelPda,
        map: map1Pda,
      })
      .rpc();

    let playerAccount = await program.account.player.fetch(playerPda);
    console.log(playerAccount);
    assert.equal(playerAccount.position.map.toString(), map1Pda.toString());
    assert.equal(playerAccount.position.cellIndex.toString(), "1");

    await program.methods
      .useConnection({
        connectionIndex: 0,
      })
      .accountsPartial({
        player: playerPda,
        hotel: hotelPda,
        sourceMap: map1Pda,
        destinationMap: map2Pda,
      })
      .rpc();

    playerAccount = await program.account.player.fetch(playerPda);
    assert.equal(playerAccount.position.map.toString(), map2Pda.toString());
    assert.equal(playerAccount.position.cellIndex.toString(), "0");
  });

  it("Delegate accounts", async () => {
    let txs = [
      await program.methods
        .delegateMap({ mapId: map1Id, hotel: hotelPda })
        .accountsPartial({
          payer: provider.wallet.publicKey,
          pda: map1Pda,
        })
        .transaction(),
      await program.methods
        .delegateMap({ mapId: map2Id, hotel: hotelPda })
        .accountsPartial({
          payer: provider.wallet.publicKey,
          pda: map2Pda,
        })
        .transaction(),
      await program.methods
        .delegatePlayer({ playerId, hotel: hotelPda })
        .accountsPartial({
          payer: provider.wallet.publicKey,
          pda: playerPda,
        })
        .transaction(),
    ];

    for (let tx of txs) {
      tx.feePayer = provider.wallet.publicKey;
      tx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;
      tx = await providerEphemeralRollup.wallet.signTransaction(tx);
      await provider.sendAndConfirm(tx, [], {
        skipPreflight: true,
        commitment: "confirmed",
      });
    }

    const map1Account = await provider.connection.getAccountInfo(map1Pda);
    assert.equal(
      map1Account.owner.toBase58(),
      DELEGATION_PROGRAM_ID.toBase58()
    );
    const map2Account = await provider.connection.getAccountInfo(map2Pda);
    assert.equal(
      map2Account.owner.toBase58(),
      DELEGATION_PROGRAM_ID.toBase58()
    );
    const playerAccount = await provider.connection.getAccountInfo(playerPda);
    assert.equal(
      playerAccount.owner.toBase58(),
      DELEGATION_PROGRAM_ID.toBase58()
    );
  });

  it("Move delegated player", async () => {
    let tx = await program.methods
      .movePlayer({
        destinationIndex: 1,
      })
      .accountsPartial({
        player: playerPda,
        hotel: hotelPda,
        map: map2Pda,
      })
      .transaction();
    tx.feePayer = providerEphemeralRollup.wallet.publicKey;
    tx.recentBlockhash = (
      await providerEphemeralRollup.connection.getLatestBlockhash()
    ).blockhash;
    tx = await providerEphemeralRollup.wallet.signTransaction(tx);
    await providerEphemeralRollup.sendAndConfirm(tx, [], {
      skipPreflight: true,
      commitment: "confirmed",
    });

    const playerAccount = await ephemeralProgram.account.player.fetch(
      playerPda
    );
    assert.equal(playerAccount.position.map.toString(), map2Pda.toString());
    assert.equal(playerAccount.position.cellIndex.toString(), "1");
  });
});
