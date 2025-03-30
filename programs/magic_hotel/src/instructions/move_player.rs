use crate::{
    constant::*,
    errors::HotelError,
    state::{Hotel, Map, Player},
};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MovePlayerArgs {
    pub destination_index: u16,
}

#[derive(Accounts)]
#[instruction(args: MovePlayerArgs)]
pub struct MovePlayer<'info> {
    #[account(
        seeds = [HOTEL_PDA_SEED, hotel.id.as_ref()],
        bump = hotel.bump,
    )]
    pub hotel: Account<'info, Hotel>,
    #[account(
        mut,
        seeds = [MAP_PDA_SEED, map.hotel.as_ref(), map.id.as_ref()],
        bump = map.bump,
        has_one = hotel,
    )]
    pub map: Account<'info, Map>,
    #[account(
        mut,
        seeds = [PLAYER_PDA_SEED, player.hotel.as_ref(), player.id.as_ref()],
        bump = player.bump,
        has_one = hotel,
    )]
    pub player: Account<'info, Player>,
}

impl<'info> MovePlayer<'info> {
    pub fn handler(ctx: Context<Self>, args: MovePlayerArgs) -> Result<()> {
        let MovePlayer {
            player,
            map,
            hotel,
        } = ctx.accounts;

        if !player.position.map.eq(&map.key()) {
            return err!(HotelError::InvalidMap);
        }
        if !player.position.is_adjacent(args.destination_index, hotel.map_size) {
            return err!(HotelError::InvalidDestination);
        }

        map.cells[player.position.cell_index as usize].occupant = None;
        map.cells[args.destination_index as usize].occupant = Some(player.id);
        player.position.cell_index = args.destination_index;

        Ok(())
    }
}
