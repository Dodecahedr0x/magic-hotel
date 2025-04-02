use anchor_lang::prelude::*;

use crate::{constant::*, state::{Hotel, GameMap, Position}};

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
        seeds = [MAP_PDA_SEED, hotel.key().as_ref(), source_map.id.as_ref()],
        bump,
    )]
    pub source_map: Account<'info, GameMap>,
    #[account(
        seeds = [MAP_PDA_SEED, hotel.key().as_ref(), destination_map.id.as_ref()],
        bump,
    )]
    pub destination_map: Account<'info, GameMap>,
}

impl<'info> CreateConnection<'info> {
    pub fn handler(ctx: Context<Self>, args: CreateConnectionArgs) -> Result<()> {
        let CreateConnection { source_map, destination_map, .. } = ctx.accounts;

        // TODO: Check if the connection is valid
        let source_pk = source_map.key();
        source_map.connections.push((Position { map: source_pk, cell_index: args.origin_cell_index }, Position { map: destination_map.key(), cell_index: args.destination_cell_index }));

        Ok(())
    }
}
