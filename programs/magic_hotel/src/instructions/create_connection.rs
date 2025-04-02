use anchor_lang::prelude::*;

use crate::{constant::*, state::{Connection, Hotel, Position, Room}};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateConnectionArgs {
    pub origin_cell_index: u16,
    pub destination_cell_index: u16,
}

#[derive(Accounts)]
#[instruction(args: CreateConnectionArgs)]
pub struct CreateConnection<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        seeds = [HOTEL_PDA_SEED, hotel.id.as_ref()],
        bump = hotel.bump,
    )]
    pub hotel: Account<'info, Hotel>,
    #[account(
        mut,
        seeds = [ROOM_PDA_SEED, hotel.key().as_ref(), source_room.id.as_ref()],
        bump,
    )]
    pub source_room: Account<'info, Room>,
    #[account(
        seeds = [ROOM_PDA_SEED, hotel.key().as_ref(), destination_room.id.as_ref()],
        bump,
    )]
    pub destination_room: Account<'info, Room>,
}

impl<'info> CreateConnection<'info> {
    pub fn handler(ctx: Context<Self>, args: CreateConnectionArgs) -> Result<()> {
        let CreateConnection { source_room, destination_room, .. } = ctx.accounts;

        // TODO: Check if the connection is valid
        let source_pk = source_room.key();
        source_room.connections.push(Connection {
            source: Position { room: source_pk, cell_index: args.origin_cell_index },
            destination: Position { room: destination_room.key(), cell_index: args.destination_cell_index },
        });

        Ok(())
    }
}
